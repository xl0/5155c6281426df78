## Handling Loading State

Three approaches to manage loading state with AI SDK RSC:

### 1. Client-side Loading State
Traditional approach: manage loading state variable on client, disable input while streaming.

```tsx
'use client';
import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState('');
  const [generation, setGeneration] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div>{generation}</div>
      <form onSubmit={async e => {
        e.preventDefault();
        setLoading(true);
        const response = await generateResponse(input);
        let textContent = '';
        for await (const delta of readStreamableValue(response)) {
          textContent += delta;
          setGeneration(textContent);
        }
        setInput('');
        setLoading(false);
      }}>
        <input type="text" value={input} disabled={loading} onChange={e => setInput(e.target.value)} />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

Server-side:
```ts
'use server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';

export async function generateResponse(prompt: string) {
  const stream = createStreamableValue();
  (async () => {
    const { textStream } = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      prompt,
    });
    for await (const text of textStream) {
      stream.update(text);
    }
    stream.done();
  })();
  return stream.value;
}
```

### 2. Streaming Loading State from Server
Create separate streamable value for loading state, read both response and loading state on client.

Server:
```ts
export async function generateResponse(prompt: string) {
  const stream = createStreamableValue();
  const loadingState = createStreamableValue({ loading: true });
  (async () => {
    const { textStream } = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      prompt,
    });
    for await (const text of textStream) {
      stream.update(text);
    }
    stream.done();
    loadingState.done({ loading: false });
  })();
  return { response: stream.value, loadingState: loadingState.value };
}
```

Client:
```tsx
const { response, loadingState } = await generateResponse(input);
for await (const responseDelta of readStreamableValue(response)) {
  textContent += responseDelta;
  setGeneration(textContent);
}
for await (const loadingDelta of readStreamableValue(loadingState)) {
  if (loadingDelta) setLoading(loadingDelta.loading);
}
```

### 3. Streaming Loading Components with `streamUI`
Use `streamUI` with JavaScript generator functions to yield loading component while awaiting model response.

Server (.tsx file):
```tsx
'use server';
import { openai } from '@ai-sdk/openai';
import { streamUI } from '@ai-sdk/rsc';

export async function generateResponse(prompt: string) {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt,
    text: async function* ({ content }) {
      yield <div>loading...</div>;
      return <div>{content}</div>;
    },
  });
  return result.value;
}
```

Client:
```tsx
'use client';
import { useState } from 'react';
import { generateResponse } from './actions';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState('');
  const [generation, setGeneration] = useState<React.ReactNode>();

  return (
    <div>
      <div>{generation}</div>
      <form onSubmit={async e => {
        e.preventDefault();
        const result = await generateResponse(input);
        setGeneration(result);
        setInput('');
      }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

Note: AI SDK RSC is experimental; use AI SDK UI for production.