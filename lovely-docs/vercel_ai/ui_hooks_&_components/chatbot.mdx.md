## useChat Hook

The `useChat` hook creates conversational UIs with real-time message streaming, managed state, and automatic UI updates.

### Core Features
- **Message Streaming**: Real-time streaming from AI providers
- **State Management**: Handles input, messages, status, error states
- **Seamless Integration**: Works with any design/layout

### Basic Example
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
          )}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        if (input.trim()) {
          sendMessage({ text: input });
          setInput('');
        }
      }}>
        <input value={input} onChange={e => setInput(e.target.value)} 
               disabled={status !== 'ready'} placeholder="Say something..." />
        <button type="submit" disabled={status !== 'ready'}>Submit</button>
      </form>
    </>
  );
}
```

Server route:
```ts
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'You are a helpful assistant.',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

Messages have a `parts` property (array of message parts) instead of just `content`. Render using `parts` for support of text, tool invocations, and tool results.

### Status Values
- `submitted`: Message sent, awaiting response stream start
- `streaming`: Response actively streaming
- `ready`: Full response received, ready for new message
- `error`: Error occurred during request

### UI Customization

**Status handling** - Show loading spinner, stop button, disable submit:
```tsx
const { messages, sendMessage, status, stop } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

{(status === 'submitted' || status === 'streaming') && (
  <div>
    {status === 'submitted' && <Spinner />}
    <button type="button" onClick={() => stop()}>Stop</button>
  </div>
)}
```

**Error handling** - Display error and retry:
```tsx
const { messages, sendMessage, error, reload } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

{error && (
  <>
    <div>An error occurred.</div>
    <button type="button" onClick={() => reload()}>Retry</button>
  </>
)}
```

**Modify messages** - Delete or edit messages:
```tsx
const { messages, setMessages } = useChat();
const handleDelete = (id) => {
  setMessages(messages.filter(message => message.id !== id));
};
```

**Cancellation and regeneration**:
```tsx
const { stop, regenerate, status } = useChat();
<button onClick={stop} disabled={!(status === 'streaming' || status === 'submitted')}>Stop</button>
<button onClick={regenerate} disabled={!(status === 'ready' || status === 'error')}>Regenerate</button>
```

**Throttle UI updates** (React only):
```tsx
const { messages } = useChat({
  experimental_throttle: 50  // milliseconds
});
```

### Event Callbacks
```tsx
const { messages } = useChat({
  onFinish: ({ message, messages, isAbort, isDisconnect, isError }) => {
    // Handle completion
  },
  onError: error => {
    console.error('An error occurred:', error);
  },
  onData: data => {
    console.log('Received data part:', data);
  },
});
```

Throwing an error in `onData` aborts processing and triggers `onError`.

### Request Configuration

**Hook-level configuration** (all requests):
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: { Authorization: 'your_token' },
    body: { user_id: '123' },
    credentials: 'same-origin',
  }),
});
```

**Dynamic hook-level configuration** (for tokens that refresh):
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: () => ({
      Authorization: `Bearer ${getAuthToken()}`,
      'X-User-ID': getCurrentUserId(),
    }),
    body: () => ({
      sessionId: getCurrentSessionId(),
      preferences: getUserPreferences(),
    }),
    credentials: () => 'include',
  }),
});
```

Use `useRef` for component state in config functions, or prefer request-level options.

**Request-level configuration** (recommended, per-request):
```tsx
sendMessage(
  { text: input },
  {
    headers: { Authorization: 'Bearer token123', 'X-Custom-Header': 'custom-value' },
    body: { temperature: 0.7, max_tokens: 100, user_id: '123' },
    metadata: { userId: 'user123', sessionId: 'session456' },
  },
);
```

Request-level options take precedence over hook-level options.

**Custom body fields per request**:
```tsx
sendMessage(
  { text: input },
  { body: { customKey: 'customValue' } },
);
```

Server-side:
```ts
export async function POST(req: Request) {
  const { messages, customKey }: { messages: UIMessage[]; customKey: string } = await req.json();
}
```

### Message Metadata

Attach custom metadata (timestamps, model details, token usage):
```tsx
// Server
return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === 'start') {
      return { createdAt: Date.now(), model: 'gpt-5.1' };
    }
    if (part.type === 'finish') {
      return { totalTokens: part.totalUsage.totalTokens };
    }
  },
});

// Client
{messages.map(message => (
  <div key={message.id}>
    {message.role}:{' '}
    {message.metadata?.createdAt && new Date(message.metadata.createdAt).toLocaleTimeString()}
    {message.parts.map((part, index) =>
      part.type === 'text' ? <span key={index}>{part.text}</span> : null,
    )}
    {message.metadata?.totalTokens && <span>{message.metadata.totalTokens} tokens</span>}
  </div>
))}
```

See Message Metadata documentation for complete examples with type safety.

### Transport Configuration

**Custom request format**:
```tsx
const { messages, sendMessage } = useChat({
  id: 'my-chat',
  transport: new DefaultChatTransport({
    prepareSendMessagesRequest: ({ id, messages }) => {
      return {
        body: {
          id,
          message: messages[messages.length - 1],
        },
      };
    },
  }),
});
```

Server:
```ts
export async function POST(req: Request) {
  const { id, message } = await req.json();
  const messages = await loadMessages(id);
  messages.push(message);
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

**Trigger-based routing** (for regeneration, etc.):
```tsx
const { messages, sendMessage, regenerate } = useChat({
  id: 'my-chat',
  transport: new DefaultChatTransport({
    prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
      if (trigger === 'submit-user-message') {
        return {
          body: {
            trigger: 'submit-user-message',
            id,
            message: messages[messages.length - 1],
            messageId,
          },
        };
      } else if (trigger === 'regenerate-assistant-message') {
        return {
          body: {
            trigger: 'regenerate-assistant-message',
            id,
            messageId,
          },
        };
      }
      throw new Error(`Unsupported trigger: ${trigger}`);
    },
  }),
});
```

Server handles different triggers:
```ts
export async function POST(req: Request) {
  const { trigger, id, message, messageId } = await req.json();
  const chat = await readChat(id);
  let messages = chat.messages;

  if (trigger === 'submit-user-message') {
    messages = [...messages, message];
  } else if (trigger === 'regenerate-assistant-message') {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      messages = messages.slice(0, messageIndex);
    }
  }

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

See Transport API documentation for custom transports.

### Response Stream Control

**Error messages** - By default masked for security ("An error occurred."). Customize with `getErrorMessage`:
```ts
return result.toUIMessageStreamResponse({
  onError: error => {
    if (error == null) return 'unknown error';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return JSON.stringify(error);
  },
});
```

**Usage information** - Track token consumption via message metadata:
```ts
type MyMetadata = { totalUsage: LanguageModelUsage };
export type MyUIMessage = UIMessage<MyMetadata>;

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    messageMetadata: ({ part }) => {
      if (part.type === 'finish') {
        return { totalUsage: part.totalUsage };
      }
    },
  });
}
```

Client access:
```tsx
const { messages } = useChat<MyUIMessage>({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  onFinish: ({ message }) => {
    console.log(message.metadata?.totalUsage);
  },
});
```

**Text streams** - Plain text streams with `TextStreamChatTransport`:
```tsx
const { messages } = useChat({
  transport: new TextStreamChatTransport({ api: '/api/chat' }),
});
```

Note: Tool calls, usage info, and finish reasons unavailable with text streams.

### Reasoning

Models like DeepSeek `deepseek-r1` and Anthropic `claude-3-7-sonnet-20250219` support reasoning tokens. Forward them with `sendReasoning`:
```ts
return result.toUIMessageStreamResponse({
  sendReasoning: true,
});
```

Client access:
```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
    {message.parts.map((part, index) => {
      if (part.type === 'text') return <div key={index}>{part.text}</div>;
      if (part.type === 'reasoning') return <pre key={index}>{part.text}</pre>;
    })}
  </div>
));
```

### Sources

Providers like Perplexity and Google Generative AI include sources. Forward with `sendSources`:
```ts
return result.toUIMessageStreamResponse({
  sendSources: true,
});
```

Client access (two types: `source-url` for web pages, `source-document` for documents):
```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
    {message.parts
      .filter(part => part.type === 'source-url')
      .map(part => (
        <span key={`source-${part.id}`}>
          [<a href={part.url} target="_blank">{part.title ?? new URL(part.url).hostname}</a>]
        </span>
      ))}
    {message.parts
      .filter(part => part.type === 'source-document')
      .map(part => (
        <span key={`source-${part.id}`}>[<span>{part.title ?? `Document ${part.id}`}</span>]</span>
      ))}
  </div>
));
```

### Image Generation

Models like Google `gemini-2.5-flash-image-preview` support image generation. Access as file parts:
```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
    {message.parts.map((part, index) => {
      if (part.type === 'text') return <div key={index}>{part.text}</div>;
      if (part.type === 'file' && part.mediaType.startsWith('image/')) {
        return <img key={index} src={part.url} alt="Generated image" />;
      }
    })}
  </div>
));
```

### Attachments

Send file attachments with messages using `FileList` or file objects.

**FileList** (from file input, auto-converts `image/*` and `text/*` to multi-modal parts):
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>
            <div>
              {message.parts.map((part, index) => {
                if (part.type === 'text') return <span key={index}>{part.text}</span>;
                if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
                  return <img key={index} src={part.url} alt={part.filename} />;
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={event => {
        event.preventDefault();
        if (input.trim()) {
          sendMessage({ text: input, files });
          setInput('');
          setFiles(undefined);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }}>
        <input type="file" onChange={event => {
          if (event.target.files) setFiles(event.target.files);
        }} multiple ref={fileInputRef} />
        <input value={input} placeholder="Send message..." 
               onChange={e => setInput(e.target.value)} disabled={status !== 'ready'} />
      </form>
    </div>
  );
}
```

**File objects** (pre-uploaded or data URLs):
```tsx
const [files] = useState<FileUIPart[]>([
  {
    type: 'file',
    filename: 'earth.png',
    mediaType: 'image/png',
    url: 'https://example.com/earth.png',
  },
  {
    type: 'file',
    filename: 'moon.png',
    mediaType: 'image/png',
    url: 'data:image/png;base64,iVBORw0KGgo...',
  },
]);

sendMessage({ text: input, files });
```

### Type Inference for Tools

**InferUITool** - Infer types from single tool:
```tsx
import { InferUITool } from 'ai';
import { z } from 'zod';

const weatherTool = {
  description: 'Get the current weather',
  inputSchema: z.object({
    location: z.string().describe('The city and state'),
  }),
  execute: async ({ location }) => {
    return `The weather in ${location} is sunny.`;
  },
};

type WeatherUITool = InferUITool<typeof weatherTool>;
// { input: { location: string }; output: string }
```

**InferUITools** - Infer types from ToolSet:
```tsx
import { InferUITools, ToolSet } from 'ai';
import { z } from 'zod';

const tools = {
  weather: {
    description: 'Get the current weather',
    inputSchema: z.object({
      location: z.string().describe('The city and state'),
    }),
    execute: async ({ location }) => {
      return `The weather in ${location} is sunny.`;
    },
  },
  calculator: {
    description: 'Perform basic arithmetic',
    inputSchema: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    }),
    execute: async ({ operation, a, b }) => {
      switch (operation) {
        case 'add': return a + b;
        case 'subtract': return a - b;
        case 'multiply': return a * b;
        case 'divide': return a / b;
      }
    },
  },
} satisfies ToolSet;

type MyUITools = InferUITools<typeof tools>;
// {
//   weather: { input: { location: string }; output: string };
//   calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number };
// }
```

**Using inferred types**:
```tsx
import { InferUITools, UIMessage, UIDataTypes } from 'ai';

type MyUITools = InferUITools<typeof tools>;
type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;

// Pass to useChat or createUIMessageStream
const { messages } = useChat<MyUIMessage>();
const stream = createUIMessageStream<MyUIMessage>(/* ... */);
```

Provides full type safety for tool inputs/outputs on client and server.