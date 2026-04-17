## Problem
The `useChat` hook no longer supports direct `headers`, `body`, and `credentials` options on the hook itself.

## Solutions

**Option 1: Request-Level Configuration (Recommended for Dynamic Values)**
Pass options when calling `sendMessage`:
```tsx
const { messages, sendMessage } = useChat();

sendMessage(
  { text: input },
  {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      'X-Request-ID': generateRequestId(),
    },
    body: {
      temperature: 0.7,
      max_tokens: 100,
      user_id: getCurrentUserId(),
      sessionId: getCurrentSessionId(),
    },
  },
);
```

**Option 2: Hook-Level Configuration with Static Values**
Use `DefaultChatTransport` for values that don't change:
```tsx
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: {
      'X-API-Version': 'v1',
      'X-App-ID': 'my-app',
    },
    body: {
      model: 'gpt-5.1',
      stream: true,
    },
    credentials: 'include',
  }),
});
```

**Option 3: Hook-Level Configuration with Functions**
Use functions for dynamic values at hook level (request-level preferred):
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
    credentials: () => (isAuthenticated() ? 'include' : 'same-origin'),
  }),
});
```

## Combining Hook and Request Level Options
Request-level options override hook-level options:
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: { 'X-API-Version': 'v1' },
    body: { model: 'gpt-5.1' },
  }),
});

sendMessage(
  { text: input },
  {
    headers: { 'X-API-Version': 'v2', 'X-Request-ID': '123' },
    body: { model: 'gpt-5-mini', temperature: 0.5 },
  },
);
```

For dynamic component state, use request-level configuration. For hook-level functions with changing state, consider using `useRef` to store current values.