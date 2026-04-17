## Streaming Custom Data

Send additional data alongside model responses using Server-Sent Events. Useful for status information, message IDs, content references, and dynamic updates.

### Type-Safe Data Streaming Setup

Define custom message types with data part schemas:

```tsx
import { UIMessage } from 'ai';

export type MyUIMessage = UIMessage<
  never,
  {
    weather: { city: string; weather?: string; status: 'loading' | 'success' };
    notification: { message: string; level: 'info' | 'warning' | 'error' };
  }
>;
```

### Server-Side Streaming

Use `createUIMessageStream` with a writer to send data:

```tsx
import { createUIMessageStream, createUIMessageStreamResponse, streamText, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = createUIMessageStream<MyUIMessage>({
    execute: ({ writer }) => {
      // Transient data (won't be added to history)
      writer.write({
        type: 'data-notification',
        data: { message: 'Processing...', level: 'info' },
        transient: true,
      });

      // Sources for RAG
      writer.write({
        type: 'source',
        value: {
          type: 'source',
          sourceType: 'url',
          id: 'source-1',
          url: 'https://weather.com',
          title: 'Weather Data Source',
        },
      });

      // Persistent data parts with loading state
      writer.write({
        type: 'data-weather',
        id: 'weather-1',
        data: { city: 'San Francisco', status: 'loading' },
      });

      const result = streamText({
        model: 'anthropic/claude-sonnet-4.5',
        messages: convertToModelMessages(messages),
        onFinish() {
          // Update same data part by ID (reconciliation)
          writer.write({
            type: 'data-weather',
            id: 'weather-1',
            data: { city: 'San Francisco', weather: 'sunny', status: 'success' },
          });

          writer.write({
            type: 'data-notification',
            data: { message: 'Request completed', level: 'info' },
            transient: true,
          });
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
```

### Data Types

**Data Parts (Persistent)** - Added to message history in `message.parts`:
```tsx
writer.write({ type: 'data-weather', id: 'weather-1', data: { city: 'SF', status: 'loading' } });
```

**Sources** - For RAG, shows referenced documents/URLs:
```tsx
writer.write({
  type: 'source',
  value: { type: 'source', sourceType: 'url', id: 'source-1', url: 'https://example.com', title: 'Example' },
});
```

**Transient Data Parts** - Sent to client but not in message history, only accessible via `onData`:
```tsx
writer.write({ type: 'data-notification', data: { message: 'Processing...', level: 'info' }, transient: true });
```

### Data Part Reconciliation

Writing to a data part with the same ID automatically updates it on the client. Enables collaborative artifacts, progressive loading, live status updates, and interactive components.

### Client-Side Processing

**Using onData callback** (essential for transient parts):

```tsx
import { useChat } from '@ai-sdk/react';

const { messages } = useChat<MyUIMessage>({
  api: '/api/chat',
  onData: dataPart => {
    if (dataPart.type === 'data-weather') {
      console.log('Weather update:', dataPart.data);
    }
    if (dataPart.type === 'data-notification') {
      showToast(dataPart.data.message, dataPart.data.level);
    }
  },
});
```

**Rendering persistent data parts**:

```tsx
const result = (
  <>
    {messages?.map(message => (
      <div key={message.id}>
        {message.parts
          .filter(part => part.type === 'data-weather')
          .map((part, index) => (
            <div key={index}>
              {part.data.status === 'loading' ? (
                <>Getting weather for {part.data.city}...</>
              ) : (
                <>Weather in {part.data.city}: {part.data.weather}</>
              )}
            </div>
          ))}

        {message.parts
          .filter(part => part.type === 'text')
          .map((part, index) => (
            <div key={index}>{part.text}</div>
          ))}

        {message.parts
          .filter(part => part.type === 'source')
          .map((part, index) => (
            <div key={index}>
              Source: <a href={part.url}>{part.title}</a>
            </div>
          ))}
      </div>
    ))}
  </>
);
```

**Complete example**:

```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat<MyUIMessage>({
    api: '/api/chat',
    onData: dataPart => {
      if (dataPart.type === 'data-notification') {
        console.log('Notification:', dataPart.data.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <>
      {messages?.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts
            .filter(part => part.type === 'data-weather')
            .map((part, index) => (
              <span key={index}>
                {part.data.status === 'loading' ? (
                  <>Getting weather for {part.data.city}...</>
                ) : (
                  <>Weather in {part.data.city}: {part.data.weather}</>
                )}
              </span>
            ))}
          {message.parts
            .filter(part => part.type === 'text')
            .map((part, index) => (
              <div key={index}>{part.text}</div>
            ))}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about the weather..." />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

### Use Cases

RAG applications (stream sources and documents), real-time status updates, collaborative tools, analytics, notifications.

### Message Metadata vs Data Parts

**Message Metadata** - Message-level information (timestamps, model info, token usage). Attached via `message.metadata`, sent using `messageMetadata` callback in `toUIMessageStreamResponse`.

**Data Parts** - Dynamic arbitrary data (dynamic content, loading states, interactive components). Added to `message.parts`, streamed via `createUIMessageStream`, can be reconciled/updated by ID, support transient parts.