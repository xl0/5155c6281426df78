## Issue
`useChat` or `useCompletion` throws "Failed to parse stream string. Invalid code" error in AI SDK version 3.0.20 or newer.

## Root Cause
AI SDK 3.0.20+ switched to a stream data protocol that supports data, tool calls, etc. The error occurs when:
- Backend uses an older version of AI SDK
- Custom provider supplies a raw text stream
- Using raw LangChain stream results

## Solution
Set the `streamProtocol` parameter to `'text'` to use raw text stream processing instead of the new protocol:

```tsx
const { messages, append } = useChat({ streamProtocol: 'text' });
```

This applies to both `useChat` and `useCompletion` hooks.