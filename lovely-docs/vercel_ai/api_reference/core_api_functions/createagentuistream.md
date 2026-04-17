## createAgentUIStream

Runs an Agent and returns a streaming UI message stream as an async iterable, allowing incremental consumption of agent reasoning and UI messages in servers, edge functions, or background jobs.

### Import
```ts
import { createAgentUIStream } from "ai"
```

### Usage
```ts
import { ToolLoopAgent, createAgentUIStream } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
});

export async function* streamAgent(messages: unknown[], abortSignal?: AbortSignal) {
  const stream = await createAgentUIStream({
    agent,
    messages,
    abortSignal,
  });

  for await (const chunk of stream) {
    yield chunk; // UI message chunk object
  }
}

// Or directly:
const controller = new AbortController();
const stream = await createAgentUIStream({
  agent,
  messages: [{ role: 'user', content: 'What is the weather in SF today?' }],
  abortSignal: controller.signal,
  sendStart: true,
});

for await (const chunk of stream) {
  console.log(chunk);
}
// Call controller.abort() to stop streaming early
```

### Parameters
- `agent` (Agent, required): Agent instance with defined tools and `.stream({ prompt })` method
- `messages` (unknown[], required): Array of input UI messages
- `abortSignal` (AbortSignal, optional): Signal to cancel streaming
- `...options` (UIMessageStreamOptions, optional): Additional customization options

### Returns
`Promise<AsyncIterableStream<UIMessageChunk>>` - async iterable of UI message chunks representing incremental agent output

### How It Works
1. Validates and normalizes incoming messages according to agent's tools
2. Converts validated UI messages to model message format
3. Invokes agent's `.stream({ prompt, abortSignal })` method
4. Exposes result stream as async iterable of UI message chunks

### Notes
- Agent must define tools and `.stream({ prompt })` method
- For HTTP responses, use createAgentUIStreamResponse or pipeAgentUIStreamToResponse instead
- Supports UIMessageStreamOptions for fine-grained output control
- Supply AbortSignal to cancel streaming operations