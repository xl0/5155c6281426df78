## Chatbot Message Persistence

Implementing message persistence allows storing and loading chat messages for AI chatbots using `useChat` and `streamText`.

### Creating New Chats

When user navigates to chat page without a chat ID, create a new chat and redirect:

```tsx
import { redirect } from 'next/navigation';
import { createChat } from '@util/chat-store';

export default async function Page() {
  const id = await createChat();
  redirect(`/chat/${id}`);
}
```

Chat store implementation (file-based example, replaceable with database):

```tsx
import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function createChat(): Promise<string> {
  const id = generateId();
  await writeFile(getChatFile(id), '[]');
  return id;
}

function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}
```

### Loading Existing Chats

```tsx
import { UIMessage } from 'ai';
import { readFile } from 'fs/promises';

export async function loadChat(id: string): Promise<UIMessage[]> {
  return JSON.parse(await readFile(getChatFile(id), 'utf8'));
}
```

### Validating Messages on Server

Use `validateUIMessages` to validate messages containing tool calls, metadata, or custom data parts before sending to model:

```tsx
import { convertToModelMessages, streamText, UIMessage, validateUIMessages, tool } from 'ai';
import { z } from 'zod';
import { loadChat, saveChat } from '@util/chat-store';
import { openai } from '@ai-sdk/openai';
import { dataPartsSchema, metadataSchema } from '@util/schemas';

const tools = {
  weather: tool({
    description: 'Get weather information',
    parameters: z.object({
      location: z.string(),
      units: z.enum(['celsius', 'fahrenheit']),
    }),
    execute: async ({ location, units }) => { /* implementation */ },
  }),
};

export async function POST(req: Request) {
  const { message, id } = await req.json();
  const previousMessages = await loadChat(id);
  const messages = [...previousMessages, message];

  const validatedMessages = await validateUIMessages({
    messages,
    tools,
    dataPartsSchema,
    metadataSchema,
  });

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(validatedMessages),
    tools,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
```

Handle validation errors gracefully:

```tsx
import { convertToModelMessages, streamText, validateUIMessages, TypeValidationError } from 'ai';

export async function POST(req: Request) {
  const { message, id } = await req.json();
  let validatedMessages;

  try {
    const previousMessages = await loadMessagesFromDB(id);
    validatedMessages = await validateUIMessages({
      messages: [...previousMessages, message],
      tools,
      metadataSchema,
    });
  } catch (error) {
    if (error instanceof TypeValidationError) {
      console.error('Database messages validation failed:', error);
      validatedMessages = [];
    } else {
      throw error;
    }
  }
  // Continue with validated messages...
}
```

### Displaying Chat

Page component loads messages from storage:

```tsx
import { loadChat } from '@util/chat-store';
import Chat from '@ui/chat';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const messages = await loadChat(id);
  return <Chat id={id} initialMessages={messages} />;
}
```

Chat component uses `useChat` hook:

```tsx
'use client';

import { UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Chat({
  id,
  initialMessages,
}: { id?: string; initialMessages?: UIMessage[] } = {}) {
  const [input, setInput] = useState('');
  const { sendMessage, messages } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts.map(part => (part.type === 'text' ? part.text : '')).join('')}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Storing Messages

Messages are stored in `onFinish` callback of `toUIMessageStreamResponse`. Note: `useChat` message format differs from `ModelMessage` format - store in `useChat` format which includes `id` and `createdAt`.

```tsx
import { openai } from '@ai-sdk/openai';
import { saveChat } from '@util/chat-store';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } = await req.json();

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(chatId), content);
}
```

### Message IDs

Each message has an ID. By default, user message IDs are generated client-side by `useChat`, and AI response IDs by `streamText` on server. For persistence, use server-side generated IDs to ensure consistency across sessions.

**Option 1: Using `generateMessageId` in `toUIMessageStreamResponse`**

```tsx
import { createIdGenerator, streamText } from 'ai';

export async function POST(req: Request) {
  const result = streamText({ /* ... */ });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({
      prefix: 'msg',
      size: 16,
    }),
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

**Option 2: Using `createUIMessageStream`**

```tsx
import { generateId, streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({
        type: 'start',
        messageId: generateId(),
      });

      const result = streamText({
        model: 'openai/gpt-5-mini',
        messages: convertToModelMessages(messages),
      });

      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
    originalMessages: messages,
    onFinish: ({ responseMessage }) => {
      // save chat
    },
  });

  return createUIMessageStreamResponse({ stream });
}
```

For client-side ID customization without persistence:

```tsx
import { createIdGenerator } from 'ai';
import { useChat } from '@ai-sdk/react';

const { ... } = useChat({
  generateId: createIdGenerator({
    prefix: 'msgc',
    size: 16,
  }),
});
```

### Sending Only Last Message

Reduce data sent to server by providing `prepareSendMessagesRequest` to transport:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { ... } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest({ messages, id }) {
      return { body: { message: messages[messages.length - 1], id } };
    },
  }),
});
```

On server, load previous messages and append new message, then validate if needed:

```tsx
import { convertToModelMessages, UIMessage, validateUIMessages } from 'ai';

export async function POST(req: Request) {
  const { message, id } = await req.json();
  const previousMessages = await loadChat(id);

  const validatedMessages = await validateUIMessages({
    messages: [...previousMessages, message],
    tools,
    metadataSchema,
    dataSchemas,
  });

  const result = streamText({
    messages: convertToModelMessages(validatedMessages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: validatedMessages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
```

### Handling Client Disconnects

By default, `streamText` uses backpressure to prevent consuming tokens not yet requested. When client disconnects, stream aborts and conversation may break. Use `consumeStream()` to consume stream on backend and save result even after client disconnect:

```tsx
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { saveChat } from '@util/chat-store';

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } = await req.json();

  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
  });

  result.consumeStream(); // no await - runs to completion regardless of client disconnect

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

When client reloads after disconnect, chat restores from storage. For production, track request state (in progress, complete) in stored messages and use on client to handle incomplete streaming on reload. See Chatbot Resume Streams documentation for more robust disconnect handling.