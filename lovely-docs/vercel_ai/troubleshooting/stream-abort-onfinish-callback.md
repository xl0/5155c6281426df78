## Problem
When using `toUIMessageStreamResponse` with an `onFinish` callback, the callback doesn't execute when the stream is aborted because the abort handler immediately terminates the response.

## Solution
Add `consumeStream` to the `toUIMessageStreamResponse` configuration to ensure abort events are properly captured and forwarded to the `onFinish` callback.

## Example
```tsx
import { consumeStream } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log('Stream was aborted');
      } else {
        console.log('Stream completed normally');
      }
    },
    consumeSseStream: consumeStream, // Enables onFinish to be called on abort
  });
}
```

The `isAborted` parameter in the `onFinish` callback indicates whether the stream was aborted, allowing for abort-specific cleanup operations.