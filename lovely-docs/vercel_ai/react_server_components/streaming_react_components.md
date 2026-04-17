## Overview

The `streamUI` function streams React Server Components from server to client. Unlike `streamText` or `streamObject`, tools provided to `streamUI` return React components instead of text/objects. The model acts as a dynamic router, understanding user intent and displaying relevant UI.

## Basic Usage

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {},
});
```

The `text` handler renders plain text responses as React components. Even with no tools, responses stream as components rather than plain text.

## Tools with streamUI

Tools are objects with:
- `description`: what the tool does
- `inputSchema`: Zod schema for inputs
- `generate`: async generator function returning a React component

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      inputSchema: z.object({ location: z.string() }),
      generate: async function* ({ location }) {
        yield <LoadingComponent />;
        const weather = await getWeather(location);
        return <WeatherComponent weather={weather} location={location} />;
      },
    },
  },
});
```

The `generate` function uses a generator (`function*`) to yield intermediate components (like loading states) before returning the final component. This allows streaming UI updates as data loads.

## Next.js Integration

### Server Action (app/actions.tsx)

```tsx
'use server';
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '82°F️ ☀️';
};

const WeatherComponent = ({ location, weather }: { location: string; weather: string }) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {location} is {weather}
  </div>
);

export async function streamComponent() {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt: 'Get the weather for San Francisco',
    text: ({ content }) => <div>{content}</div>,
    tools: {
      getWeather: {
        description: 'Get the weather for a location',
        inputSchema: z.object({ location: z.string() }),
        generate: async function* ({ location }) {
          yield <LoadingComponent />;
          const weather = await getWeather(location);
          return <WeatherComponent weather={weather} location={location} />;
        },
      },
    },
  });
  return result.value;
}
```

### Client Page (app/page.tsx)

```tsx
'use client';
import { useState } from 'react';
import { streamComponent } from './actions';

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();
  return (
    <div>
      <form onSubmit={async e => { e.preventDefault(); setComponent(await streamComponent()); }}>
        <button>Stream Component</button>
      </form>
      <div>{component}</div>
    </div>
  );
}
```

The Server Action calls `streamUI` and returns `result.value`. The client component calls this action on form submission and renders the returned ReactNode.

## Key Concepts

- `streamUI` requires returning a React component (via `text` handler or tool `generate` function)
- Tools with `streamUI` work like other AI SDK Core tools but return components
- Generator functions in tool `generate` allow yielding intermediate UI (loading states) before final result
- Model decides whether to call tools based on context; if no relevant tool, uses `text` handler
- Currently experimental; AI SDK UI recommended for production