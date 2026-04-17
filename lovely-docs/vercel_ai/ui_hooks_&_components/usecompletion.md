## useCompletion Hook

React hook for streaming text completions from AI providers. Manages state for chat input, handles streaming responses, and updates UI automatically.

### Basic Usage

```tsx
import { useCompletion } from '@ai-sdk/react';

export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: '/api/completion',
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" value={input} onChange={handleInputChange} />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

Server endpoint:
```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt,
  });
  return result.toUIMessageStreamResponse();
}
```

### State and Callbacks

Available states: `completion`, `input`, `isLoading`, `error`

```tsx
const { isLoading, error, ... } = useCompletion();

// Show loading state
{isLoading ? <Spinner /> : null}

// Handle errors
useEffect(() => {
  if (error) toast.error(error.message);
}, [error]);
```

### Input Control

Controlled input with `handleInputChange` and `handleSubmit`, or granular control:
```tsx
const { input, setInput } = useCompletion();
<MyCustomInput value={input} onChange={value => setInput(value)} />
```

### Cancellation

```tsx
const { stop, isLoading } = useCompletion();
<button onClick={stop} disabled={!isLoading}>Stop</button>
```

Calling `stop()` aborts the fetch request.

### UI Update Throttling

React only. Throttle renders with `experimental_throttle` option (in milliseconds):
```tsx
const { completion } = useCompletion({
  experimental_throttle: 50
});
```

### Event Callbacks

```tsx
useCompletion({
  onResponse: (response: Response) => { /* ... */ },
  onFinish: (prompt: string, completion: string) => { /* ... */ },
  onError: (error: Error) => { /* ... */ },
});
```

Throwing an error in `onResponse` aborts processing and triggers `onError`.

### Request Customization

```tsx
useCompletion({
  api: '/api/custom-completion',
  headers: { Authorization: 'token' },
  body: { user_id: '123' },
  credentials: 'same-origin',
});
```