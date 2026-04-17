## simulateStreamingMiddleware

Middleware that converts non-streaming language model responses into simulated streams, maintaining a consistent streaming interface regardless of model capabilities.

### Purpose
Allows you to use a uniform streaming interface even when working with models that only provide complete responses rather than streaming chunks.

### How It Works
1. Awaits the complete response from the language model
2. Creates a `ReadableStream` that emits chunks in the correct sequence
3. Breaks down the response into appropriate chunk types
4. Preserves all metadata, reasoning, tool calls, and other response properties

### Usage
```ts
import { streamText, wrapLanguageModel, simulateStreamingMiddleware } from 'ai';

const result = streamText({
  model: wrapLanguageModel({
    model: nonStreamingModel,
    middleware: simulateStreamingMiddleware(),
  }),
  prompt: 'Your prompt here',
});

for await (const chunk of result.fullStream) {
  // Process streaming chunks
}
```

### API
- **Parameters**: None
- **Returns**: Middleware object that handles response conversion and streaming simulation
- **Handles**: Text content, reasoning (string or array of objects), tool calls, metadata, usage information, and warnings