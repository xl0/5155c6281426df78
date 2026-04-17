## Issue

`useChat` with `resume: true` for stream resumption is incompatible with abort functionality. When a page is closed, refreshed, or `stop()` is called, the browser sends an abort signal that breaks the resumption mechanism.

```tsx
const { messages, stop } = useChat({
  id: chatId,
  resume: true, // Conflicts with abort
});
// Closing tab triggers abort, preventing stream resumption
```

## Workaround

Choose one approach based on requirements:

**Option 1: Stream resumption without abort**
```tsx
const { messages, sendMessage } = useChat({
  id: chatId,
  resume: true,
});
```

**Option 2: Abort without stream resumption**
```tsx
const { messages, sendMessage, stop } = useChat({
  id: chatId,
  resume: false,
});
```

The team is exploring solutions but currently both features cannot be used together.