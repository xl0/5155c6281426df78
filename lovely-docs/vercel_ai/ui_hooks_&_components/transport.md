## Default Transport

`useChat` uses HTTP POST to `/api/chat` by default:

```tsx
import { useChat } from '@ai-sdk/react';
const { messages, sendMessage } = useChat();
```

Equivalent to:
```tsx
import { DefaultChatTransport } from 'ai';
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});
```

## Custom Transport Configuration

Configure default transport with custom options:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: {
      Authorization: 'Bearer your-token',
      'X-API-Version': '2024-01',
    },
    credentials: 'include',
  }),
});
```

### Dynamic Configuration

Use functions for runtime-dependent values:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: () => ({
      Authorization: `Bearer ${getAuthToken()}`,
      'X-User-ID': getCurrentUserId(),
    }),
    body: () => ({
      sessionId: getCurrentSessionId(),
      preferences: getUserPreferences(),
    }),
    credentials: () => 'include',
  }),
});
```

### Request Transformation

Transform requests before sending:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
      return {
        headers: { 'X-Session-ID': id },
        body: {
          messages: messages.slice(-10),
          trigger,
          messageId,
        },
      };
    },
  }),
});
```

## Building Custom Transports

Implement the ChatTransport interface. Reference implementations:
- DefaultChatTransport - complete HTTP transport
- HttpChatTransport - base HTTP transport with request handling
- ChatTransport interface - interface to implement

Custom transports handle: `sendMessages` method, UI message streams, request/response transformation, error and connection management.