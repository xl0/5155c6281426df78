## ToolLoopAgent

A reusable AI agent class that creates autonomous, multi-step agents capable of generating text, streaming responses, and iteratively invoking tools until a stop condition is reached. Unlike single-step calls, agents can collect tool results and decide next actions in a reasoning-and-acting loop.

### Constructor Parameters

- `model` (required): LanguageModel instance
- `instructions`: System prompt/context (string or SystemModelMessage)
- `tools`: Record of available tools (requires model support for tool calling)
- `toolChoice`: Tool selection strategy ('auto' | 'none' | 'required' | {type: 'tool', toolName: string}), default 'auto'
- `stopWhen`: Stop condition(s), default stepCountIs(20)
- `activeTools`: Array limiting available tools for a specific call
- `output`: Structured output specification for type-safe parsing
- `prepareStep`: Function to mutate step settings or inject state per step
- `experimental_repairToolCall`: Callback for automatic recovery on unparseable tool calls
- `onStepFinish`: Callback after each agent step completes
- `experimental_context`: Custom context object passed to tool calls
- `experimental_telemetry`: Telemetry configuration
- `experimental_download`: Custom download function for files/URLs
- `maxOutputTokens`, `temperature`, `topP`, `topK`, `presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`: Model parameters
- `maxRetries`: Retry count on failure, default 2
- `abortSignal`: Cancel ongoing request
- `providerOptions`: Provider-specific configuration
- `id`: Custom agent identifier

### Methods

**`generate()`**: Runs agent loop and returns final result as GenerateTextResult
- Parameters: `prompt` (string | ModelMessage[]), `messages` (ModelMessage[]), `abortSignal`
- Returns: GenerateTextResult with text, steps array, and other metadata

**`stream()`**: Streams agent response including reasoning and tool calls as they occur, returns StreamTextResult
- Parameters: `prompt`, `messages`, `abortSignal`, `experimental_transform`
- Returns: StreamTextResult with textStream and other metadata

### Types

**`InferAgentUIMessage<AgentType, MetadataType?>`**: Infers type-safe UI message type for given agent instance, optionally with custom metadata schema.

### Examples

Basic agent with tools:
```ts
const assistant = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
  stopWhen: stepCountIs(3),
});
const result = await assistant.generate({
  prompt: 'What is the weather in NYC and what is 100 * 25?',
});
console.log(result.text, result.steps);
```

Streaming:
```ts
const stream = agent.stream({
  prompt: 'Tell me a short story about a time traveler.',
});
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

Output parsing with Zod schema:
```ts
const analysisAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  output: {
    schema: z.object({
      sentiment: z.enum(['positive', 'negative', 'neutral']),
      score: z.number(),
      summary: z.string(),
    }),
  },
});
const result = await analysisAgent.generate({
  prompt: 'Analyze this review: "The product exceeded my expectations!"',
});
console.log(result.output); // Type-safe output
```

Type-safe UI messages with metadata:
```ts
const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: weatherTool },
});
type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;

// With custom metadata
const metadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
  finishReason: z.string().optional(),
});
type MetadataAgentUIMessage = InferAgentUIMessage<typeof metadataAgent, z.infer<typeof metadataSchema>>;
```