## Message Metadata

Attach custom information to messages at the message level (distinct from data parts which are content-level). Useful for timestamps, model info, token usage, user context, and performance metrics.

### Defining Metadata Types

Define a Zod schema for type safety:

```tsx
import { UIMessage } from 'ai';
import { z } from 'zod';

export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
export type MyUIMessage = UIMessage<MessageMetadata>;
```

### Sending Metadata from Server

Use the `messageMetadata` callback in `toUIMessageStreamResponse`:

```ts
import { streamText } from 'ai';
import type { MyUIMessage } from '@/types';

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    messageMetadata: ({ part }) => {
      if (part.type === 'start') {
        return {
          createdAt: Date.now(),
          model: 'gpt-5.1',
        };
      }
      if (part.type === 'finish') {
        return {
          totalTokens: part.totalUsage.totalTokens,
        };
      }
    },
  });
}
```

Pass `originalMessages` typed to your UIMessage type for type-safe metadata returns.

### Accessing Metadata on Client

Access via `message.metadata` property:

```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import type { MyUIMessage } from '@/types';

export default function Chat() {
  const { messages } = useChat<MyUIMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.metadata?.createdAt && (
              <span className="text-sm text-gray-500">
                {new Date(message.metadata.createdAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          {message.parts.map((part, index) =>
            part.type === 'text' ? <div key={index}>{part.text}</div> : null,
          )}
          {message.metadata?.totalTokens && (
            <div className="text-xs text-gray-400">
              {message.metadata.totalTokens} tokens
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Use Cases

- Timestamps: creation/completion times
- Model information: which AI model was used
- Token usage: track costs and limits
- User context: user IDs, session info
- Performance metrics: generation time, time to first token
- Quality indicators: finish reason, confidence scores