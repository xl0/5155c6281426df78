## Warnings

Warnings appear in the browser console when unsupported features, compatibility issues, or other problems are detected. All warnings start with "AI SDK Warning:".

Control warnings globally:
```ts
// Turn off all warnings
globalThis.AI_SDK_LOG_WARNINGS = false;

// Custom warning handler
globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => {
  // Handle warnings your own way
};
```

## Error Handling

Each UI hook returns an `error` object for rendering errors in the UI. Use it to show error messages, disable buttons, or show retry buttons.

**Example with retry button:**
```tsx
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, error, regenerate } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.parts.filter(p => p.type === 'text').map(p => p.text).join('')}
        </div>
      ))}
      {error && (
        <>
          <div>An error occurred.</div>
          <button onClick={() => regenerate()}>Retry</button>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} disabled={error != null} />
      </form>
    </div>
  );
}
```

**Alternative: Replace last message on error:**
```tsx
const { sendMessage, error, messages, setMessages } = useChat();

function customSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (error != null) {
    setMessages(messages.slice(0, -1)); // remove last message
  }
  sendMessage({ text: input });
  setInput('');
}
```

**Error handling callback:**
Pass an `onError` callback to `useChat` or `useCompletion` hooks:
```tsx
const { /* ... */ } = useChat({
  onError: error => {
    console.error(error);
  },
});
```

**Testing errors:**
Throw an error in your route handler:
```ts
export async function POST(req: Request) {
  throw new Error('This is a test error');
}
```

Best practice: Show generic error messages to users to avoid leaking server information.