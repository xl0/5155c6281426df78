## Purpose
Creates tools with unknown input/output types determined at runtime, useful for MCP tools without schemas, user-defined functions loaded at runtime, tools from external sources, and dynamic tool generation.

## Key Differences from `tool()`
- Accepts and returns `unknown` types instead of compile-time known types
- Requires runtime validation/casting of inputs
- Marked with `type: 'dynamic'` in the returned Tool object

## API

**Parameters:**
- `description` (optional string): Purpose and usage details for the model
- `inputSchema` (FlexibleSchema<unknown>): Schema for validation; use `z.unknown()` or `z.any()` for fully dynamic inputs
- `execute` (async function): Called with tool arguments; input typed as `unknown`; receives `ToolCallOptions` with `toolCallId`, `messages`, and optional `abortSignal`
- `toModelOutput` (optional function): Converts tool result to format usable by language model
- `providerOptions` (optional): Provider-specific metadata

**Returns:** `Tool<unknown, unknown>` with `type: 'dynamic'`

## Examples

Basic dynamic tool:
```ts
import { dynamicTool } from 'ai';
import { z } from 'zod';

const customTool = dynamicTool({
  description: 'Execute a custom user-defined function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return { result: `Executed ${action} with ${JSON.stringify(parameters)}` };
  },
});
```

Type-safe usage with mixed static/dynamic tools:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: weatherTool,  // static
    custom: dynamicTool({ /* ... */ }),  // dynamic
  },
  onStepFinish: ({ toolCalls }) => {
    for (const toolCall of toolCalls) {
      if (toolCall.dynamic) {
        console.log('Dynamic:', toolCall.toolName, toolCall.input);
      } else {
        switch (toolCall.toolName) {
          case 'weather':
            console.log(toolCall.input.location);  // fully typed
        }
      }
    }
  },
});
```

With `useChat` (UIMessage format), dynamic tools appear as `dynamic-tool` parts:
```tsx
message.parts.map(part => {
  if (part.type === 'dynamic-tool') {
    return <div><h4>Tool: {part.toolName}</h4><pre>{JSON.stringify(part.input, null, 2)}</pre></div>;
  }
});
```