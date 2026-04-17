## Problem
When using `useChat` with `streamText` on the server, assistant messages appear duplicated in the UI - showing both previous and new messages, or the same message multiple times. This occurs because `toUIMessageStreamResponse` generates new message IDs for each message.

## Solution
Pass the original messages array to `toUIMessageStreamResponse` using the `originalMessages` option. This allows the method to reuse existing message IDs instead of generating new ones, ensuring the client updates existing messages rather than creating duplicates.

## Example
```tsx
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
    tools: {
      weather: {
        description: 'Get the weather for a location',
        parameters: z.object({
          location: z.string(),
        }),
        execute: async ({ location }) => {
          return { temperature: 72, condition: 'sunny' };
        },
      },
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: ({ messages }) => {
      saveChat({ id, messages });
    },
  });
}
```