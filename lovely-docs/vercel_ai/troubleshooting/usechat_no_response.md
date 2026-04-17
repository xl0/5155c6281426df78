## Problem
When using `useChat`, tool calls and tool results appear in server logs, but the model doesn't respond with anything.

## Solution
Convert incoming messages to `ModelMessage` format using the `convertToModelMessages` function before passing them to `streamText`.

### Example
```tsx
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

The key change is wrapping the incoming `messages` with `convertToModelMessages()` before passing to `streamText()`. This ensures the message format is compatible with the model.