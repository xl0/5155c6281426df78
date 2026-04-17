## streamText()

Streams text generations from a language model for interactive use cases like chatbots and real-time applications. Supports tool calling and UI component generation.

### Basic Usage

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

### Key Parameters

**Model & Input:**
- `model` (LanguageModel): The language model to use
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `prompt` (string | Array<ModelMessage>): Input prompt or conversation messages
- `messages` (Array<ModelMessage>): Conversation messages with support for text, images, and files

**Message Types:**
- SystemModelMessage: `{ role: 'system', content: string }`
- UserModelMessage: `{ role: 'user', content: string | Array<TextPart | ImagePart | FilePart> }`
- AssistantModelMessage: `{ role: 'assistant', content: string | Array<TextPart | ReasoningPart | FilePart | ToolCallPart> }`
- ToolModelMessage: `{ role: 'tool', content: Array<ToolResultPart> }`

**Tools:**
- `tools` (ToolSet): Tools accessible to the model with description, inputSchema (Zod or JSON Schema), and optional execute function
- `toolChoice` ("auto" | "none" | "required" | { type: "tool", toolName: string }): How tools are selected
- `activeTools` (Array<string>): Which tools are currently active
- `stopWhen` (StopCondition | Array<StopCondition>): Condition for stopping generation with tool results

**Generation Control:**
- `maxOutputTokens` (number): Maximum tokens to generate
- `temperature` (number): Randomness (0-1 range, provider-dependent)
- `topP` (number): Nucleus sampling
- `topK` (number): Sample from top K options
- `presencePenalty` (number): Likelihood to repeat information in prompt
- `frequencyPenalty` (number): Likelihood to repeat same words/phrases
- `stopSequences` (string[]): Sequences that stop generation
- `seed` (number): For deterministic results

**Advanced:**
- `maxRetries` (number): Default 2
- `abortSignal` (AbortSignal): Cancel the call
- `headers` (Record<string, string>): Additional HTTP headers
- `output` (Output): Specification for parsing structured outputs (text, object, array, choice, json)
- `prepareStep` (function): Modify settings per step (model, toolChoice, activeTools, system, messages)
- `experimental_context` (unknown): Context passed to tool execution
- `experimental_download` (function): Custom URL download function
- `experimental_repairToolCall` (function): Repair failed tool call parsing
- `experimental_telemetry` (TelemetrySettings): Enable/disable telemetry, record inputs/outputs, add metadata
- `experimental_transform` (StreamTextTransform | Array<StreamTextTransform>): Stream transformations
- `includeRawChunks` (boolean): Include raw provider chunks
- `providerOptions` (Record<string, JSONObject>): Provider-specific options

**Callbacks:**
- `onChunk` (event: OnChunkResult): Called for each stream chunk
- `onError` (event: OnErrorResult): Called on errors
- `onStepFinish` (result: onStepFinishResult): Called when a step finishes
- `onFinish` (result: OnFinishResult): Called when LLM response and tool executions complete
- `onAbort` (event: OnAbortResult): Called when stream is aborted

### Return Values

**Promises (auto-consume stream):**
- `content` (Promise<Array<ContentPart>>): Generated content in last step
- `text` (Promise<string>): Full generated text
- `reasoning` (Promise<Array<ReasoningOutput>>): Model reasoning (if available)
- `reasoningText` (Promise<string | undefined>): Reasoning text
- `sources` (Promise<Array<Source>>): Sources used (RAG models)
- `files` (Promise<Array<GeneratedFile>>): Generated files
- `toolCalls` (Promise<TypedToolCall[]>): Executed tool calls
- `toolResults` (Promise<TypedToolResult[]>): Tool execution results
- `finishReason` (Promise<'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'>)
- `usage` (Promise<LanguageModelUsage>): Token usage of last step
- `totalUsage` (Promise<LanguageModelUsage>): Total token usage across all steps
- `providerMetadata` (Promise<ProviderMetadata | undefined>)
- `request` (Promise<LanguageModelRequestMetadata>): Request body sent to provider
- `response` (Promise<LanguageModelResponseMetadata>): Response metadata with messages
- `warnings` (Promise<Warning[] | undefined>): Provider warnings
- `steps` (Promise<Array<StepResult>>): Information for every step

**Streams:**
- `textStream` (AsyncIterableStream<string>): Text deltas only
- `fullStream` (AsyncIterable<TextStreamPart> & ReadableStream): All events including text, tool calls, tool results, errors
- `partialOutputStream` (AsyncIterableStream<PARTIAL_OUTPUT>): Partial parsed outputs using output specification
- `output` (Promise<COMPLETE_OUTPUT>): Complete parsed output

**Stream Part Types:**
- `{ type: 'text', text: string }`: Text delta
- `{ type: 'reasoning', text: string, providerMetadata?: ProviderMetadata }`: Reasoning
- `{ type: 'source', sourceType: 'url', id: string, url: string, title?: string, providerMetadata?: ProviderMetadata }`: Source
- `{ type: 'file', file: GeneratedFile }`: Generated file
- `{ type: 'tool-call', toolCallId: string, toolName: string, input: object }`: Tool call
- `{ type: 'tool-call-streaming-start', toolCallId: string, toolName: string }`: Tool call start
- `{ type: 'tool-call-delta', toolCallId: string, toolName: string, argsTextDelta: string }`: Tool call argument delta
- `{ type: 'tool-result', toolCallId: string, toolName: string, input: object, output: any }`: Tool result
- `{ type: 'start-step', request: LanguageModelRequestMetadata, warnings: Warning[] }`: Step start
- `{ type: 'finish-step', response: LanguageModelResponseMetadata, usage: LanguageModelUsage, finishReason: string, providerMetadata?: ProviderMetadata }`: Step finish
- `{ type: 'start' }`: Stream start
- `{ type: 'finish', finishReason: string, totalUsage: LanguageModelUsage }`: Stream finish
- `{ type: 'reasoning-part-finish' }`: Reasoning part end
- `{ type: 'error', error: unknown }`: Error
- `{ type: 'abort' }`: Abort

**Response Conversion:**
- `toUIMessageStream(options?: UIMessageStreamOptions)`: Convert to UI message stream
- `pipeUIMessageStreamToResponse(response: ServerResponse, options?: ResponseInit & UIMessageStreamOptions)`: Write to Node.js response
- `pipeTextStreamToResponse(response: ServerResponse, init?: ResponseInit)`: Write text deltas to Node.js response
- `toUIMessageStreamResponse(options?: ResponseInit & UIMessageStreamOptions)`: Create streamed response with UI messages
- `toTextStreamResponse(init?: ResponseInit)`: Create simple text stream response
- `consumeStream(options?: ConsumeStreamOptions)`: Consume stream without processing

### Examples

**Basic text streaming:**
```ts
const { textStream } = streamText({
  model: openai('gpt-4'),
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

**Chat with messages:**
```ts
const { text } = await streamText({
  model: openai('gpt-4'),
  messages: [
    { role: 'user', content: 'What is the capital of France?' }
  ],
});
```

**With tools:**
```ts
const { fullStream } = streamText({
  model: openai('gpt-4'),
  prompt: 'Get the weather',
  tools: {
    getWeather: {
      description: 'Get weather for a location',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temp: 72, location })
    }
  }
});

for await (const event of fullStream) {
  if (event.type === 'tool-call') {
    console.log(`Calling ${event.toolName}:`, event.input);
  } else if (event.type === 'tool-result') {
    console.log(`Result:`, event.output);
  } else if (event.type === 'text') {
    process.stdout.write(event.text);
  }
}
```

**Structured output:**
```ts
const { output } = await streamText({
  model: openai('gpt-4'),
  prompt: 'Generate a recipe',
  output: Output.object({
    schema: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string())
    })
  })
});

const recipe = await output;
```

**With callbacks:**
```ts
const result = streamText({
  model: openai('gpt-4'),
  prompt: 'Hello',
  onChunk: async (event) => {
    console.log('Chunk:', event.chunk);
  },
  onStepFinish: async (result) => {
    console.log('Step finished:', result.finishReason, result.usage);
  },
  onFinish: async (result) => {
    console.log('Complete:', result.text, result.totalUsage);
  },
  onError: async (event) => {
    console.error('Error:', event.error);
  }
});

await result.text;
```

**Response conversion in Next.js:**
```ts
export async function POST(req: Request) {
  const result = streamText({
    model: openai('gpt-4'),
    messages: await req.json()
  });
  
  return result.toTextStreamResponse();
}
```

**Multi-step with prepareStep:**
```ts
const { text } = await streamText({
  model: openai('gpt-4'),
  prompt: 'Solve this step by step',
  prepareStep: async ({ stepNumber, messages }) => {
    if (stepNumber > 1) {
      return {
        system: 'Continue solving the problem'
      };
    }
  }
});
```