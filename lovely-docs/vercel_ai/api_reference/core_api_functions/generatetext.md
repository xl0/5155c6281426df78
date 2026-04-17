## generateText()

Generates text and calls tools for a given prompt using a language model. Ideal for non-interactive use cases like automation tasks (drafting emails, summarizing web pages) and agents that use tools.

### Basic Usage

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

console.log(text);
```

### Parameters

**Core:**
- `model` (LanguageModel): The language model to use, e.g., `openai('gpt-4o')`
- `prompt` (string | Array<ModelMessage>): Input prompt or conversation messages
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `messages` (Array<ModelMessage>): Conversation messages (SystemModelMessage, UserModelMessage, AssistantModelMessage, ToolModelMessage)

**Message Content Types:**
- UserModelMessage: `role: 'user'`, content can be string or array of TextPart, ImagePart, FilePart
- AssistantModelMessage: `role: 'assistant'`, content can be string or array of TextPart, ReasoningPart, FilePart, ToolCallPart
- ToolModelMessage: `role: 'tool'`, content is array of ToolResultPart with toolCallId, toolName, output, isError

**Tools:**
- `tools` (ToolSet): Tools accessible to the model. Each tool has:
  - `description` (optional): Purpose and usage details
  - `inputSchema` (Zod Schema | JSON Schema): Expected input structure
  - `execute` (optional): Async function `(parameters, options) => RESULT` that runs the tool
- `toolChoice` (optional): "auto" | "none" | "required" | { type: "tool", toolName: string }. Default: "auto"
- `activeTools` (optional): Array limiting which tools are available

**Generation Control:**
- `maxOutputTokens` (optional): Maximum tokens to generate
- `temperature` (optional): Randomness (0-1 range, provider-dependent)
- `topP` (optional): Nucleus sampling (0-1 range, provider-dependent)
- `topK` (optional): Sample from top K options
- `presencePenalty` (optional): Penalizes repeating information in prompt
- `frequencyPenalty` (optional): Penalizes repeating same words/phrases
- `stopSequences` (optional): Sequences that stop generation
- `seed` (optional): Integer for deterministic results (if supported)

**Advanced:**
- `maxRetries` (optional): Max retry attempts. Default: 2
- `abortSignal` (optional): AbortSignal to cancel the call
- `headers` (optional): Additional HTTP headers for HTTP-based providers
- `providerOptions` (optional): Provider-specific options
- `output` (optional): Structured output specification:
  - `Output.text()`: Text generation (default)
  - `Output.object({ schema })`: Typed object generation
  - `Output.array({ element })`: Array generation
  - `Output.choice({ options })`: Choice from options
  - `Output.json()`: Unstructured JSON
- `stopWhen` (optional): Condition for stopping generation with tool results. Default: stepCountIs(1)
- `prepareStep` (optional): Function to modify settings per step (model, toolChoice, activeTools, system, messages)
- `experimental_telemetry` (optional): Telemetry configuration (isEnabled, recordInputs, recordOutputs, functionId, metadata)
- `experimental_context` (optional): Context passed to tool execution
- `experimental_download` (optional): Custom download function for URLs in prompts
- `experimental_repairToolCall` (optional): Function to repair failed tool call parsing

**Callbacks:**
- `onStepFinish` (optional): Called when a step finishes. Receives: finishReason, usage, totalUsage, text, toolCalls, toolResults, warnings, response, isContinued, providerMetadata
- `onFinish` (optional): Called when LLM response and all tool executions complete. Receives: finishReason, usage, providerMetadata, text, reasoning, reasoningDetails, sources, files, toolCalls, toolResults, warnings, response, steps

### Return Value

- `content` (Array<ContentPart>): Generated content in last step
- `text` (string): Generated text
- `reasoning` (Array<ReasoningOutput>): Full reasoning from last step (if available)
- `reasoningText` (string | undefined): Reasoning text from last step
- `sources` (Array<Source>): URL sources used (from RAG models)
- `files` (Array<GeneratedFile>): Generated files with base64, uint8Array, mediaType
- `toolCalls` (ToolCallArray): Tool calls made in last step
- `toolResults` (ToolResultArray): Results of tool calls from last step
- `finishReason` ('stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown')
- `usage` (LanguageModelUsage): Token usage of last step (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- `totalUsage` (LanguageModelUsage): Cumulative token usage across all steps
- `request` (optional): Raw request HTTP body
- `response` (optional): Response metadata (id, modelId, timestamp, headers, body, messages)
- `warnings` (optional): Provider warnings
- `providerMetadata` (optional): Provider-specific metadata
- `steps` (Array<StepResult>): Response info for each step

### Examples

**Text generation:**
```ts
const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Chat completion:**
```ts
const { text } = await generateText({
  model: openai('gpt-4o'),
  messages: [
    { role: 'user', content: 'What is the capital of France?' }
  ],
});
```

**Tool calling:**
```ts
const { toolCalls, toolResults } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Get the weather',
  tools: {
    getWeather: {
      description: 'Get weather for a location',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temp: 72, location })
    }
  }
});
```

**Structured output:**
```ts
const { output } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Generate a person',
  output: Output.object({
    schema: z.object({ name: z.string(), age: z.number() })
  })
});
```

**With callbacks:**
```ts
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Write a story',
  onStepFinish: ({ text, usage }) => console.log(text, usage),
  onFinish: ({ text, totalUsage }) => console.log('Done:', text, totalUsage)
});
```

**Multi-step with prepareStep:**
```ts
const { text, steps } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Solve this problem',
  tools: { calculate: { ... } },
  prepareStep: ({ stepNumber, steps }) => {
    if (stepNumber === 1) return { toolChoice: 'required' };
    return { toolChoice: 'none' };
  }
});
```