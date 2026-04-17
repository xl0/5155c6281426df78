## Tool Calling

Tools are objects that models can call to perform specific tasks. Each tool has:
- `description`: Optional description influencing tool selection
- `inputSchema`: Zod or JSON schema defining input parameters, validated by LLM
- `execute`: Optional async function receiving validated inputs, returns a value

Tools are passed as an object with tool names as keys:

```ts
import { z } from 'zod';
import { generateText, tool } from 'ai';

const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Multi-Step Calls (stopWhen)

With `stopWhen`, models can generate multiple tool calls and text responses in sequence. Each generation (tool call or text) is a step. The SDK automatically triggers new generations passing tool results until no further tool calls occur or the stopping condition is met.

```ts
import { generateText, tool, stepCountIs } from 'ai';

const { text, steps } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { /* ... */ },
  stopWhen: stepCountIs(5), // max 5 steps
  prompt: 'What is the weather in San Francisco?',
});

// Extract tool calls from all steps
const allToolCalls = steps.flatMap(step => step.toolCalls);
```

### Callbacks

**`onStepFinish`**: Triggered when a step completes with text, tool calls, tool results, and finish reason:
```ts
onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
  // save chat history, record usage, etc.
}
```

**`prepareStep`**: Called before each step starts. Receives `model`, `stopWhen`, `stepNumber`, `steps`, `messages`. Can return modified settings:
```ts
prepareStep: async ({ model, stepNumber, steps, messages }) => {
  if (stepNumber === 0) {
    return {
      model: differentModel,
      toolChoice: { type: 'tool', toolName: 'tool1' },
      activeTools: ['tool1'],
    };
  }
  // For longer loops, compress messages:
  if (messages.length > 20) {
    return { messages: messages.slice(-10) };
  }
}
```

### Response Messages

Both `generateText` and `streamText` return `response.messages` containing assistant and tool messages to add to conversation history:

```ts
const messages: ModelMessage[] = [/* ... */];
const { response } = await generateText({ /* ... */, messages });
messages.push(...response.messages);
```

## Dynamic Tools

For tools with unknown schemas at compile time (MCP tools, user-defined functions, external sources), use `dynamicTool`:

```ts
import { dynamicTool } from 'ai';

const customTool = dynamicTool({
  description: 'Execute a custom function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return { result: `Executed ${action}` };
  },
});
```

Type-safe handling with `dynamic` flag:
```ts
onStepFinish: ({ toolCalls }) => {
  for (const toolCall of toolCalls) {
    if (toolCall.dynamic) {
      console.log('Dynamic:', toolCall.toolName, toolCall.input); // input is 'unknown'
    } else {
      switch (toolCall.toolName) {
        case 'weather':
          console.log(toolCall.input.location); // typed as string
      }
    }
  }
}
```

## Preliminary Tool Results

Return `AsyncIterable` from `execute` to stream multiple results. Last value is final result:

```ts
tool({
  description: 'Get the current weather.',
  inputSchema: z.object({ location: z.string() }),
  async *execute({ location }) {
    yield { status: 'loading', text: `Getting weather for ${location}` };
    await new Promise(resolve => setTimeout(resolve, 3000));
    const temperature = 72 + Math.floor(Math.random() * 21) - 10;
    yield { status: 'success', text: `The weather in ${location} is ${temperature}°F`, temperature };
  },
})
```

## Tool Choice

Control when tools are selected via `toolChoice`:
- `auto` (default): Model chooses whether and which tools to call
- `required`: Model must call a tool
- `none`: Model must not call tools
- `{ type: 'tool', toolName: string }`: Model must call specific tool

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { /* ... */ },
  toolChoice: 'required',
  prompt: 'What is the weather in San Francisco?',
});
```

## Tool Execution Options

Tools receive a second parameter with execution options:

**Tool Call ID**: Forward tool-call-related information:
```ts
execute: async (args, { toolCallId }) => {
  writer.write({
    type: 'data-tool-status',
    id: toolCallId,
    data: { name: 'myTool', status: 'in-progress' },
  });
}
```

**Messages**: Access message history from all previous steps:
```ts
execute: async (args, { messages }) => {
  // use message history in calls to other language models
}
```

**Abort Signals**: Forward abort signals for cancellation:
```ts
execute: async ({ location }, { abortSignal }) => {
  return fetch(`https://api.weatherapi.com/v1/current.json?q=${location}`, { signal: abortSignal });
}
```

**Context (experimental)**: Pass arbitrary context:
```ts
const result = await generateText({
  tools: {
    someTool: tool({
      execute: async (input, { experimental_context: context }) => {
        const typedContext = context as { example: string };
      },
    }),
  },
  experimental_context: { example: '123' },
});
```

## Tool Input Lifecycle Hooks

Available in `streamText` only:
- `onInputStart`: When model starts generating input
- `onInputDelta`: For each chunk of streamed input
- `onInputAvailable`: When complete input is available and validated

```ts
tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({ location: z.string() }),
  execute: async ({ location }) => ({ temperature: 72 + Math.floor(Math.random() * 21) - 10 }),
  onInputStart: () => console.log('Tool call starting'),
  onInputDelta: ({ inputTextDelta }) => console.log('Received input chunk:', inputTextDelta),
  onInputAvailable: ({ input }) => console.log('Complete input:', input),
})
```

## Types

Use helper types for type-safe tool definitions outside `generateText`/`streamText`:

```ts
import { TypedToolCall, TypedToolResult, generateText, tool } from 'ai';

const myToolSet = {
  firstTool: tool({
    description: 'Greets the user',
    inputSchema: z.object({ name: z.string() }),
    execute: async ({ name }) => `Hello, ${name}!`,
  }),
  secondTool: tool({
    description: 'Tells the user their age',
    inputSchema: z.object({ age: z.number() }),
    execute: async ({ age }) => `You are ${age} years old!`,
  }),
};

type MyToolCall = TypedToolCall<typeof myToolSet>;
type MyToolResult = TypedToolResult<typeof myToolSet>;

async function generateSomething(prompt: string): Promise<{
  text: string;
  toolCalls: Array<MyToolCall>;
  toolResults: Array<MyToolResult>;
}> {
  return generateText({
    model: 'anthropic/claude-sonnet-4.5',
    tools: myToolSet,
    prompt,
  });
}
```

## Error Handling

Three tool-call related errors:
- `NoSuchToolError`: Model calls undefined tool
- `InvalidToolInputError`: Tool inputs don't match schema
- `ToolCallRepairError`: Error during tool call repair

```ts
try {
  const result = await generateText({ /* ... */ });
} catch (error) {
  if (NoSuchToolError.isInstance(error)) {
    // handle
  } else if (InvalidToolInputError.isInstance(error)) {
    // handle
  }
}
```

Tool execution errors appear as `tool-error` parts in result steps:
```ts
const { steps } = await generateText({ /* ... */ });
const toolErrors = steps.flatMap(step =>
  step.content.filter(part => part.type === 'tool-error'),
);
toolErrors.forEach(toolError => {
  console.log('Tool error:', toolError.error, toolError.toolName, toolError.input);
});
```

For `streamText`, use `toUIMessageStreamResponse` with `onError`:
```ts
result.toUIMessageStreamResponse({
  onError: error => {
    if (NoSuchToolError.isInstance(error)) return 'Unknown tool.';
    if (InvalidToolInputError.isInstance(error)) return 'Invalid inputs.';
    return 'Unknown error.';
  },
});
```

## Tool Call Repair (experimental)

Use `experimental_repairToolCall` to fix invalid tool calls without additional steps:

```ts
const result = await generateText({
  model,
  tools,
  prompt,
  experimental_repairToolCall: async ({ toolCall, tools, inputSchema, error }) => {
    if (NoSuchToolError.isInstance(error)) return null;
    
    const tool = tools[toolCall.toolName as keyof typeof tools];
    const { object: repairedArgs } = await generateObject({
      model: 'anthropic/claude-sonnet-4.5',
      schema: tool.inputSchema,
      prompt: `Fix the tool call "${toolCall.toolName}" with inputs: ${JSON.stringify(toolCall.input)}`,
    });
    return { ...toolCall, input: JSON.stringify(repairedArgs) };
  },
});
```

Re-ask strategy:
```ts
experimental_repairToolCall: async ({ toolCall, tools, error, messages, system }) => {
  const result = await generateText({
    model,
    system,
    messages: [
      ...messages,
      { role: 'assistant', content: [{ type: 'tool-call', toolCallId: toolCall.toolCallId, toolName: toolCall.toolName, input: toolCall.input }] },
      { role: 'tool', content: [{ type: 'tool-result', toolCallId: toolCall.toolCallId, toolName: toolCall.toolName, output: error.message }] },
    ],
    tools,
  });
  const newToolCall = result.toolCalls.find(tc => tc.toolName === toolCall.toolName);
  return newToolCall ? { toolCallType: 'function', toolCallId: toolCall.toolCallId, toolName: toolCall.toolName, input: JSON.stringify(newToolCall.input) } : null;
}
```

## Active Tools

Limit available tools to model while maintaining static typing:

```ts
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: myToolSet,
  activeTools: ['firstTool'],
});
```

## Multi-modal Tool Results (experimental)

Supported by Anthropic and OpenAI. Use optional `toModelOutput` function to convert tool results to content parts:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    computer: anthropic.tools.computer_20241022({
      async execute({ action, coordinate, text }) {
        switch (action) {
          case 'screenshot':
            return { type: 'image', data: fs.readFileSync('./data/screenshot-editor.png').toString('base64') };
          default:
            return `executed ${action}`;
        }
      },
      toModelOutput(result) {
        return {
          type: 'content',
          value: typeof result === 'string'
            ? [{ type: 'text', text: result }]
            : [{ type: 'media', data: result.data, mediaType: 'image/png' }],
        };
      },
    }),
  },
});
```

## Extracting Tools

Use `tool` helper for correct type inference when extracting to separate files:

```ts
// tools/weather-tool.ts
import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});
```

## MCP Tools

AI SDK supports Model Context Protocol servers for standardized tool access. See MCP Tools documentation for details.

**AI SDK Tools vs MCP Tools**:
| Aspect | AI SDK Tools | MCP Tools |
|--------|-------------|-----------|
| Type Safety | Full static typing | Dynamic discovery |
| Execution | Same process (low latency) | Separate server (network overhead) |
| Prompt Control | Full control | Controlled by MCP server |
| Schema Control | You define | Controlled by MCP server |
| Version Management | Full visibility | Independent updates (version skew risk) |
| Authentication | Same process | Separate server auth |
| Best For | Production (control/performance) | Development (user-provided tools) |
