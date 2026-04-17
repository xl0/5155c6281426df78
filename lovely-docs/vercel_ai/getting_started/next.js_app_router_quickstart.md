## Setup

Prerequisites: Node.js 18+, pnpm, Vercel AI Gateway API key.

Create Next.js app with App Router and Tailwind CSS:
```bash
pnpm create next-app@latest my-ai-app
cd my-ai-app
```

Install dependencies:
```bash
pnpm add ai@beta @ai-sdk/react@beta zod
```

Configure API key in `.env.local`:
```env
AI_GATEWAY_API_KEY=xxxxxxxxx
```

## Basic Chat Route Handler

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

Key concepts:
- `streamText()` accepts model provider and messages array
- `UIMessage[]` contains conversation history with metadata (timestamps, sender info)
- `convertToModelMessages()` strips UI metadata to convert `UIMessage[]` to `ModelMessage[]` format
- `toUIMessageStreamResponse()` converts result to streamed response

## Provider Configuration

Default uses Vercel AI Gateway (included in `ai` package). Access models with string:
```ts
model: 'anthropic/claude-sonnet-4.5'
```

Or explicitly:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers, install and import:
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## Chat UI

Create `app/page.tsx`:
```tsx
'use client';

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

`useChat()` hook provides:
- `messages` - array of chat messages with `id`, `role`, `parts` properties
- `sendMessage()` - function to send message to `/api/chat` endpoint
- Message `parts` array contains ordered components of model output (text, reasoning tokens, etc.)

Run with `pnpm run dev` and visit http://localhost:3000.

## Tools

Tools allow LLMs to invoke actions and receive results for next response. Example: weather tool.

Update `app/api/chat/route.ts`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

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

  return result.toUIMessageStreamResponse();
}
```

Tool definition includes:
- `description` - helps model understand when to use it
- `inputSchema` - Zod schema defining required inputs; model extracts from context or asks user
- `execute` - async function running on server; can fetch from external APIs

`stopWhen: stepCountIs(5)` allows model to use up to 5 steps, enabling multi-step tool calls where model uses tool results to answer original query.

Tool parts in message are named `tool-{toolName}`, e.g., `tool-weather`.

Update `app/page.tsx` to display tool results:
```tsx
case 'tool-weather':
case 'tool-convertFahrenheitToCelsius':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

Example flow: "What's the weather in New York in celsius?" → model calls weather tool → displays result → calls temperature conversion tool → provides natural language response.