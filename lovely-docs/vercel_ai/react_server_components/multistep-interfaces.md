## Multistep Interfaces with AI SDK RSC

Multistep interfaces are UIs requiring multiple independent steps to complete a task. Example: flight booking with steps for searching flights, picking a flight, and checking availability.

### Key Concepts

**Tool composition**: Combining multiple tools to create a new tool, breaking complex tasks into manageable steps.

**Application context**: The state of the application including user input, model output, and relevant information passed between steps.

### Architecture

Required components:
- Server Action calling `streamUI` function
- Tool(s) defining sub-tasks
- React component(s) rendered when tools are called
- Page rendering the chatbot

Flow:
1. User sends message via Server Action with `useActions`
2. Message appended to AI State, passed to model with tools
3. Model calls tool, rendering component
4. Component uses `useActions` to call model and `useUIState` to append response
5. Process repeats

### Turn-by-Turn Implementation

Define tools with `streamUI`:

```tsx
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const searchFlights = async (source: string, destination: string, date: string) => {
  return [{ id: '1', flightNumber: 'AA123' }, { id: '2', flightNumber: 'AA456' }];
};

const lookupFlight = async (flightNumber: string) => {
  return { flightNumber, departureTime: '10:00 AM', arrivalTime: '12:00 PM' };
};

export async function submitUserMessage(input: string) {
  'use server';
  const ui = await streamUI({
    model: openai('gpt-4o'),
    system: 'you are a flight booking assistant',
    prompt: input,
    text: async ({ content }) => <div>{content}</div>,
    tools: {
      searchFlights: {
        description: 'search for flights',
        inputSchema: z.object({
          source: z.string().describe('The origin of the flight'),
          destination: z.string().describe('The destination of the flight'),
          date: z.string().describe('The date of the flight'),
        }),
        generate: async function* ({ source, destination, date }) {
          yield `Searching for flights from ${source} to ${destination} on ${date}...`;
          const results = await searchFlights(source, destination, date);
          return (
            <div>
              {results.map(result => (
                <div key={result.id}>{result.flightNumber}</div>
              ))}
            </div>
          );
        },
      },
      lookupFlight: {
        description: 'lookup details for a flight',
        parameters: z.object({
          flightNumber: z.string().describe('The flight number'),
        }),
        generate: async function* ({ flightNumber }) {
          yield `Looking up details for flight ${flightNumber}...`;
          const details = await lookupFlight(flightNumber);
          return (
            <div>
              <div>Flight Number: {details.flightNumber}</div>
              <div>Departure Time: {details.departureTime}</div>
              <div>Arrival Time: {details.arrivalTime}</div>
            </div>
          );
        },
      },
    },
  });
  return ui.value;
}
```

Create AI context:

```ts
import { createAI } from '@ai-sdk/rsc';
import { submitUserMessage } from './actions';

export const AI = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: { submitUserMessage },
});
```

Wrap application in layout:

```tsx
import { AI } from './ai';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AI>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AI>
  );
}
```

Render chatbot on page:

```tsx
'use client';

import { useState } from 'react';
import { useActions, useUIState } from '@ai-sdk/rsc';
import { AI } from './ai';

export default function Page() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(currentConversation => [...currentConversation, <div>{input}</div>]);
    const message = await submitUserMessage(input);
    setConversation(currentConversation => [...currentConversation, message]);
  };

  return (
    <div>
      <div>
        {conversation.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

### Adding Interactivity

Convert tool components to client components using `useActions` and `useUIState` to trigger next steps:

```tsx
'use client';

import { useActions, useUIState } from '@ai-sdk/rsc';
import { ReactNode } from 'react';

interface FlightsProps {
  flights: { id: string; flightNumber: string }[];
}

export const Flights = ({ flights }: FlightsProps) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <div>
      {flights.map(result => (
        <div
          key={result.id}
          onClick={async () => {
            const display = await submitUserMessage(`lookupFlight ${result.flightNumber}`);
            setMessages((messages: ReactNode[]) => [...messages, display]);
          }}
        >
          {result.flightNumber}
        </div>
      ))}
    </div>
  );
};
```

Update tool to render interactive component:

```tsx
searchFlights: {
  description: 'search for flights',
  parameters: z.object({
    source: z.string().describe('The origin of the flight'),
    destination: z.string().describe('The destination of the flight'),
    date: z.string().describe('The date of the flight'),
  }),
  generate: async function* ({ source, destination, date }) {
    yield `Searching for flights from ${source} to ${destination} on ${date}...`;
    const results = await searchFlights(source, destination, date);
    return <Flights flights={results} />;
  },
}
```

Note: AI SDK RSC is experimental; use AI SDK UI for production.