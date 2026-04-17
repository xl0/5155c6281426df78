## Stream Protocols

AI SDK UI functions (`useChat`, `useCompletion`, `useObject`) support two stream protocols that define how data is streamed to the frontend over HTTP.

### Text Stream Protocol

Plain text chunks streamed and appended together. Generated with `streamText` backend function, returned via `toTextStreamResponse()`.

**Text Stream Example:**

Frontend with `TextStreamChatTransport`:
```tsx
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' }),
  });

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => 
            part.type === 'text' && <div key={`${message.id}-${i}`}>{part.text}</div>
          )}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input value={input} onChange={e => setInput(e.currentTarget.value)} />
      </form>
    </div>
  );
}
```

Backend:
```ts
import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toTextStreamResponse();
}
```

Text streams only support basic text data. For tool calls and other data types, use data streams.

### Data Stream Protocol

Uses Server-Sent Events (SSE) format with keep-alive pings, reconnect capabilities, and better cache handling. Default for `useChat` and `useCompletion`. Requires `x-vercel-ai-ui-message-stream: v1` header from custom backends.

**Supported Stream Parts:**

- **Message Start**: `{"type":"start","messageId":"..."}`
- **Text Parts** (start/delta/end pattern):
  - Start: `{"type":"text-start","id":"msg_..."}`
  - Delta: `{"type":"text-delta","id":"msg_...","delta":"Hello"}`
  - End: `{"type":"text-end","id":"msg_..."}`
- **Reasoning Parts** (start/delta/end pattern):
  - Start: `{"type":"reasoning-start","id":"reasoning_123"}`
  - Delta: `{"type":"reasoning-delta","id":"reasoning_123","delta":"This is some reasoning"}`
  - End: `{"type":"reasoning-end","id":"reasoning_123"}`
- **Source Parts**:
  - URL: `{"type":"source-url","sourceId":"https://example.com","url":"https://example.com"}`
  - Document: `{"type":"source-document","sourceId":"https://example.com","mediaType":"file","title":"Title"}`
- **File Part**: `{"type":"file","url":"https://example.com/file.png","mediaType":"image/png"}`
- **Data Parts** (custom): `{"type":"data-weather","data":{"location":"SF","temperature":100}}`
- **Error Part**: `{"type":"error","errorText":"error message"}`
- **Tool Input Parts**:
  - Start: `{"type":"tool-input-start","toolCallId":"call_...","toolName":"getWeatherInformation"}`
  - Delta: `{"type":"tool-input-delta","toolCallId":"call_...","inputTextDelta":"San Francisco"}`
  - Available: `{"type":"tool-input-available","toolCallId":"call_...","toolName":"getWeatherInformation","input":{"city":"San Francisco"}}`
- **Tool Output Part**: `{"type":"tool-output-available","toolCallId":"call_...","output":{"city":"San Francisco","weather":"sunny"}}`
- **Step Parts**:
  - Start: `{"type":"start-step"}`
  - Finish: `{"type":"finish-step"}`
- **Finish Message**: `{"type":"finish"}`
- **Stream Termination**: `data: [DONE]`

**UI Message Stream Example:**

Frontend (default protocol):
```tsx
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => 
            part.type === 'text' && <div key={`${message.id}-${i}`}>{part.text}</div>
          )}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input value={input} onChange={e => setInput(e.currentTarget.value)} />
      </form>
    </div>
  );
}
```

Backend:
```ts
import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

`useCompletion` only supports text and data stream parts. Use `toUIMessageStreamResponse()` on backend `streamText` result to return streaming HTTP response.