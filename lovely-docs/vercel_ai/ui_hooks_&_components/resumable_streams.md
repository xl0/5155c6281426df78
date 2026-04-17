## Stream Resumption Overview

`useChat` supports resuming ongoing streams after page reloads for long-running generations. Requires persistence layer for messages and active streams.

**Warning**: Stream resumption is incompatible with abort functionality. Page refresh/tab close triggers abort signal that breaks resumption. Don't use `resume: true` if abort is needed.

## What the AI SDK Provides

- `resume` option in `useChat` for automatic stream reconnection
- `consumeSseStream` callback to access outgoing streams
- Automatic HTTP requests to resume endpoints

## What You Build

- Storage to track stream ID per chat
- Redis to store UIMessage stream
- POST endpoint to create streams
- GET endpoint to resume streams
- Integration with `resumable-stream` package for Redis management

## Prerequisites

1. `resumable-stream` npm package (publisher/subscriber for streams)
2. Redis instance (stores stream data)
3. Persistence layer (tracks active stream ID per chat)

## Implementation

### Client-side: Enable resumption

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';

export function Chat({
  chatData,
  resume = false,
}: {
  chatData: { id: string; messages: UIMessage[] };
  resume?: boolean;
}) {
  const { messages, sendMessage, status } = useChat({
    id: chatData.id,
    messages: chatData.messages,
    resume,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ id, messages }) => {
        return {
          body: {
            id,
            message: messages[messages.length - 1],
          },
        };
      },
    }),
  });

  return <div>{/* Your chat UI */}</div>;
}
```

When `resume: true`, `useChat` makes GET request to `/api/chat/[id]/stream` on mount. Must send chat ID with each request.

### POST handler: Create resumable stream

```ts
import { openai } from '@ai-sdk/openai';
import { readChat, saveChat } from '@util/chat-store';
import {
  convertToModelMessages,
  generateId,
  streamText,
  type UIMessage,
} from 'ai';
import { after } from 'next/server';
import { createResumableStreamContext } from 'resumable-stream';

export async function POST(req: Request) {
  const { message, id }: { message: UIMessage | undefined; id: string } =
    await req.json();

  const chat = await readChat(id);
  let messages = [...chat.messages, message!];

  saveChat({ id, messages, activeStreamId: null });

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: ({ messages }) => {
      saveChat({ id, messages, activeStreamId: null });
    },
    async consumeSseStream({ stream }) {
      const streamId = generateId();
      const streamContext = createResumableStreamContext({ waitUntil: after });
      await streamContext.createNewResumableStream(streamId, () => stream);
      saveChat({ id, activeStreamId: streamId });
    },
  });
}
```

### GET handler: Resume stream

```ts
import { readChat } from '@util/chat-store';
import { UI_MESSAGE_STREAM_HEADERS } from 'ai';
import { after } from 'next/server';
import { createResumableStreamContext } from 'resumable-stream';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const chat = await readChat(id);

  if (chat.activeStreamId == null) {
    return new Response(null, { status: 204 });
  }

  const streamContext = createResumableStreamContext({ waitUntil: after });
  return new Response(
    await streamContext.resumeExistingStream(chat.activeStreamId),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}
```

The `after` function from Next.js allows work to continue after response is sent, ensuring resumable stream persists in Redis for later reconnection.

## Request Lifecycle

1. **Stream creation**: POST handler uses `streamText`, `consumeSseStream` creates resumable stream with unique ID, stores in Redis
2. **Stream tracking**: Persistence layer saves `activeStreamId` in chat data
3. **Client reconnection**: `resume: true` triggers GET request to `/api/chat/[id]/stream`
4. **Stream recovery**: GET handler checks for `activeStreamId`, uses `resumeExistingStream` to reconnect, returns 204 if no active stream
5. **Completion cleanup**: `onFinish` callback clears `activeStreamId` by setting to `null`

## Customize Resume Endpoint

Default GET request goes to `/api/chat/[id]/stream`. Customize using `prepareReconnectToStreamRequest` in `DefaultChatTransport`:

```tsx
const { messages, sendMessage } = useChat({
  id: chatData.id,
  messages: chatData.messages,
  resume,
  transport: new DefaultChatTransport({
    prepareReconnectToStreamRequest: ({ id }) => {
      return {
        api: `/api/chat/${id}/stream`, // or `/api/streams/${id}/resume`
        credentials: 'include',
        headers: {
          Authorization: 'Bearer token',
          'X-Custom-Header': 'value',
        },
      };
    },
  }),
});
```

## Important Considerations

- **Incompatible with abort**: Don't use `resume: true` if abort functionality needed
- **Stream expiration**: Streams in Redis expire after configurable time
- **Multiple clients**: Multiple clients can connect to same stream simultaneously
- **Error handling**: GET returns 204 when no active stream exists
- **Security**: Ensure proper authentication/authorization for create and resume endpoints
- **Race conditions**: Clear `activeStreamId` when starting new stream to prevent resuming outdated streams