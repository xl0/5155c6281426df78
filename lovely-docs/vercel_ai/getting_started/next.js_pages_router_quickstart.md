## Setup

Create a Next.js app with Pages Router (not App Router):
```bash
pnpm create next-app@latest my-ai-app
cd my-ai-app
```

Install dependencies:
```bash
pnpm add ai@beta @ai-sdk/react@beta zod@beta
```

Configure API key in `.env.local`:
```env
AI_GATEWAY_API_KEY=your_key_here
```

## Route Handler

Create `app/api/chat/route.ts`:
```tsx
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

The handler extracts messages from request, calls `streamText` with a model and converted messages (UIMessage → ModelMessage strips metadata), and returns the streamed response via `toUIMessageStreamResponse()`.

## Provider Selection

Default uses Vercel AI Gateway (string model references like `'anthropic/claude-sonnet-4.5'`). Can also use:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers, install their package:
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## UI Component

Create `pages/index.tsx`:
```tsx
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

`useChat` hook provides `messages` (array with id, role, parts) and `sendMessage(text)`. Messages contain `parts` array where each part has a type (text, tool calls, etc.). Run with `pnpm run dev` and visit http://localhost:3000.

## Tools

Add tools to route handler to let the model invoke actions:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return { location, temperature };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

Tool parts appear in message.parts as `tool-{toolName}`. Update UI to display them:
```tsx
case 'tool-weather':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

## Multi-Step Tool Calls

By default, generation stops after first step when there are tool results. Enable multi-step with `stopWhen`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),
  tools: {
    weather: tool({
      description: 'Get the weather in a location (fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert a temperature in fahrenheit to celsius',
      inputSchema: z.object({
        temperature: z.number().describe('The temperature in fahrenheit to convert'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
});
```

Update UI to handle new tool part:
```tsx
case 'tool-weather':
case 'tool-convertFahrenheitToCelsius':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

With `stopWhen: stepCountIs(5)`, the model can use up to 5 steps, allowing it to call multiple tools in sequence and use their results to answer questions.