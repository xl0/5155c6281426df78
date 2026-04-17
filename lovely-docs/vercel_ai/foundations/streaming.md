## Why Streaming Matters

Large language models generate long outputs slowly (5-40s latency). Blocking UIs force users to wait for the entire response before displaying anything, causing poor UX. Streaming UIs display response parts as they become available, improving perceived performance and user experience.

## Blocking vs Streaming

**Blocking UI**: Waits for full response generation before displaying anything.

**Streaming UI**: Transmits and displays response parts incrementally as they're generated.

Real-world example: Generating the first 200 characters of a Harry Potter book shows streaming displays results much faster than blocking because it doesn't wait for completion.

## When to Use Streaming

Streaming greatly enhances UX with larger models, but isn't always necessary. Smaller, faster models may not need streaming and can lead to simpler development.

## Implementation

The AI SDK makes streaming simple. Stream text generation from OpenAI's gpt-4.1 in under 10 lines using `streamText`:

```ts
import { streamText } from 'ai';

const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a poem about embedding models.',
});

for await (const textPart of textStream) {
  console.log(textPart);
}
```

The `streamText` function returns a `textStream` that can be iterated with `for await` to process each text chunk as it arrives.