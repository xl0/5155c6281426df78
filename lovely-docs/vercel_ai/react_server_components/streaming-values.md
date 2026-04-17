## Streaming Values Overview

The RSC API provides utilities to stream values from server to client with granular control. Two main functions:

### `createStreamableValue`

Creates a streamable serializable value (strings, numbers, objects, arrays). Useful for streaming text generations, buffer values from multi-modal models, or progress updates.

**Example:**
```tsx
// Server Action
'use server';
import { createStreamableValue } from '@ai-sdk/rsc';

export const runThread = async () => {
  const streamableStatus = createStreamableValue('thread.init');
  
  setTimeout(() => {
    streamableStatus.update('thread.run.create');
    streamableStatus.update('thread.run.update');
    streamableStatus.update('thread.run.end');
    streamableStatus.done('thread.end');
  }, 1000);

  return { status: streamableStatus.value };
};

// Client
import { readStreamableValue } from '@ai-sdk/rsc';
import { runThread } from '@/actions';

export default function Page() {
  return (
    <button onClick={async () => {
      const { status } = await runThread();
      for await (const value of readStreamableValue(status)) {
        console.log(value);
      }
    }}>
      Ask
    </button>
  );
}
```

Read with `readStreamableValue`, which returns an async iterator yielding updated values.

### `createStreamableUI`

Creates a stream holding a React component. Provides granular control over streaming React components without calling an LLM.

**Example:**
```tsx
// Server Action
'use server';
import { createStreamableUI } from '@ai-sdk/rsc';

export async function getWeather() {
  const weatherUI = createStreamableUI();
  weatherUI.update(<div style={{ color: 'gray' }}>Loading...</div>);
  
  setTimeout(() => {
    weatherUI.done(<div>It's a sunny day!</div>);
  }, 1000);

  return weatherUI.value;
}

// Client
'use client';
import { useState } from 'react';
import { getWeather } from '@/actions';

export default function Page() {
  const [weather, setWeather] = useState<React.ReactNode | null>(null);

  return (
    <div>
      <button onClick={async () => {
        const weatherUI = await getWeather();
        setWeather(weatherUI);
      }}>
        What's the weather?
      </button>
      {weather}
    </div>
  );
}
```

The `.value` property contains the UI to send to client. Call `.update()` to stream intermediate states, `.done()` to finalize.

These utilities pair with AI SDK Core functions like `streamText` and `streamObject` for streaming LLM generations.