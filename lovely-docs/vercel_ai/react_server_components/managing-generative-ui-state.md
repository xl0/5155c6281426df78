## Overview

State management in AI applications requires special handling because LLMs need serializable context. With Generative UI, models return React components which aren't serializable, so state must be split into two parts: AI State (serializable, sent to model) and UI State (client-side, can contain React elements).

## AI State vs UI State

**AI State**: Serializable JSON representation of application state used on server and shared with LLM. For chat apps, it's the conversation history with messages containing role and content. Can also store metadata like `createdAt` and `chatId`. Accessible/modifiable from both server and client. Serves as source of truth.

**UI State**: Client-side only state (like `useState`) containing actual rendered UI elements. Can store JavaScript values and React elements.

## Setup with createAI

Define types and create context:

```tsx
// app/actions.tsx
export type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ClientMessage = {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
};

export const sendMessage = async (input: string): Promise<ClientMessage> => {
  "use server"
  // ...
}

// app/ai.ts
import { createAI } from '@ai-sdk/rsc';

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: { sendMessage },
});

// app/layout.tsx
import { AI } from './ai';

export default function RootLayout({ children }) {
  return (
    <AI>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AI>
  );
}
```

## Reading State

**UI State (client)** with `useUIState`:
```tsx
'use client';
import { useUIState } from '@ai-sdk/rsc';

export default function Page() {
  const [messages, setMessages] = useUIState();
  return <ul>{messages.map(m => <li key={m.id}>{m.display}</li>)}</ul>;
}
```

**AI State (client)** with `useAIState`:
```tsx
'use client';
import { useAIState } from '@ai-sdk/rsc';

export default function Page() {
  const [messages, setMessages] = useAIState();
  return <ul>{messages.map(m => <li key={m.id}>{m.content}</li>)}</ul>;
}
```

**AI State (server)** with `getAIState` in Server Actions:
```tsx
import { getAIState } from '@ai-sdk/rsc';

export async function sendMessage(message: string) {
  'use server';
  const history = getAIState();
  const response = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: [...history, { role: 'user', content: message }],
  });
  return response;
}
```

## Updating AI State on Server

Use `getMutableAIState` to read and update:
```tsx
import { getMutableAIState } from '@ai-sdk/rsc';

export async function sendMessage(message: string) {
  'use server';
  const history = getMutableAIState();
  
  history.update([...history.get(), { role: 'user', content: message }]);
  
  const response = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: history.get(),
  });
  
  history.done([...history.get(), { role: 'assistant', content: response }]);
  return response;
}
```

Use `.update()` for intermediate updates and `.done()` for final state.

## Calling Server Actions from Client

Use `useActions` hook to access actions:
```tsx
'use client';
import { useActions, useUIState } from '@ai-sdk/rsc';
import { AI } from './ai';

export default function Page() {
  const { sendMessage } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState();

  const handleSubmit = async event => {
    event.preventDefault();
    setMessages([
      ...messages,
      { id: Date.now(), role: 'user', display: event.target.message.value },
    ]);

    const response = await sendMessage(event.target.message.value);
    setMessages([
      ...messages,
      { id: Date.now(), role: 'assistant', display: response },
    ]);
  };

  return (
    <>
      <ul>
        {messages.map(m => <li key={m.id}>{m.display}</li>)}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

Must update UI State after calling Server Action for streamed components to display.

## Key Points

- AI State is the source of truth, passed to LLM
- UI State is client-only, can contain React components
- Use `createAI` to set up context with initial states and actions
- Access AI State server-side with `getAIState` or `getMutableAIState` within registered actions
- Access both states client-side with `useAIState` and `useUIState`
- Call server actions from client with `useActions`
- Always update UI State after server action calls