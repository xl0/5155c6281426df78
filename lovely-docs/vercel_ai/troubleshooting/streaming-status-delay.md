## Problem
When using `useChat`, the status immediately changes to "streaming" but no text appears for several seconds.

## Root Cause
The status changes to "streaming" as soon as the server connection is established and streaming begins, including metadata streaming before LLM tokens arrive.

## Solution
Create a custom loading state that checks if the last assistant message contains actual content:

```tsx
'use client';
import { useChat } from '@ai-sdk/react';

export default function Page() {
  const { messages, status } = useChat();
  const lastMessage = messages.at(-1);
  
  const showLoader =
    status === 'streaming' &&
    lastMessage?.role === 'assistant' &&
    lastMessage?.parts?.length === 0;

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
          )}
        </div>
      ))}
      {showLoader && <div>Loading...</div>}
    </>
  );
}
```

Alternative: check for specific part types:
```tsx
const showLoader =
  status === 'streaming' &&
  lastMessage?.role === 'assistant' &&
  !lastMessage?.parts?.some(part => part.type === 'text');
```