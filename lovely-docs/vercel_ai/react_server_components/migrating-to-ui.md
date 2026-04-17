## Migrating from AI SDK RSC to AI SDK UI

AI SDK RSC is experimental and unsuitable for production due to significant limitations:
- Cannot abort streams using server actions
- Components remount on `.done()` causing flicker
- Many suspense boundaries can crash
- `createStreamableUI` causes quadratic data transfer
- Closed RSC streams cause update issues

AI SDK UI is the recommended stable alternative with production-grade features: language model middleware, multi-step tool calls, attachments, telemetry, provider registry.

### Streaming Chat Completions

**Before (RSC):** `streamUI` in server action combines generation and rendering
```tsx
// @/app/actions.tsx
export async function sendMessage(message: string) {
  'use server';
  const messages = getMutableAIState('messages');
  messages.update([...messages.get(), { role: 'user', content: message }]);
  const { value: stream } = await streamUI({
    model: openai('gpt-4o'),
    system: 'you are a friendly assistant!',
    messages: messages.get(),
    text: async function* ({ content, done }) { /* process text */ },
    tools: { /* tool definitions */ },
  });
  return stream;
}

// @/app/page.tsx - client calls server action
'use client';
export default function Page() {
  const { sendMessage } = useActions();
  const [messages, setMessages] = useUIState();
  return (
    <div>
      {messages.map(message => message)}
      <form onSubmit={async () => {
        const response = await sendMessage(input);
        setMessages(msgs => [...msgs, response]);
      }}>
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
```

**After (UI):** Separate concerns - `streamText` in route handler, `useChat` on client
```ts
// @/app/api/chat/route.ts
export async function POST(request) {
  const { messages } = await request.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'you are a friendly assistant!',
    messages,
    tools: { /* tool definitions */ },
  });
  return result.toUIMessageStreamResponse();
}

// @/app/page.tsx
'use client';
export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Parallel and Multi-Step Tool Calls

RSC `streamUI` doesn't support parallel or multi-step tool calls. UI `useChat` has built-in support - define multiple tools in `streamText` and set `maxSteps` for multi-step calls; `useChat` handles them automatically.

### Generative User Interfaces

**Before (RSC):** Render components in server action
```tsx
// @/app/actions.tsx
const { value: stream } = await streamUI({
  model: openai('gpt-4o'),
  system: 'you are a friendly assistant!',
  messages,
  text: async function* ({ content, done }) { /* process text */ },
  tools: {
    displayWeather: {
      description: 'Display the weather for a location',
      inputSchema: z.object({ latitude: z.number(), longitude: z.number() }),
      generate: async function* ({ latitude, longitude }) {
        yield <div>Loading weather...</div>;
        const { value, unit } = await getWeather({ latitude, longitude });
        return <Weather value={value} unit={unit} />;
      },
    },
  },
});
```

**After (UI):** Stream props data, render on client
```ts
// @/app/api/chat/route.ts
export async function POST(request) {
  const { messages } = await request.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'you are a friendly assistant!',
    messages,
    tools: {
      displayWeather: {
        description: 'Display the weather for a location',
        parameters: z.object({ latitude: z.number(), longitude: z.number() }),
        execute: async ({ latitude, longitude }) => {
          const props = await getWeather({ latitude, longitude });
          return props;
        },
      },
    },
  });
  return result.toUIMessageStreamResponse();
}

// @/app/page.tsx
'use client';
export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
          <div>
            {message.toolInvocations?.map(toolInvocation => {
              const { toolName, toolCallId, state } = toolInvocation;
              if (state === 'result') {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayWeather' ? (
                      <Weather weatherAtLocation={toolInvocation.result} />
                    ) : null}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayWeather' ? (
                      <div>Loading weather...</div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Handling Client Interactions

**Before (RSC):** Components use `useActions` hook to trigger server actions
```tsx
// @/app/components/list-flights.tsx
'use client';
export function ListFlights({ flights }) {
  const { sendMessage } = useActions();
  const [_, setMessages] = useUIState();
  return (
    <div>
      {flights.map(flight => (
        <div key={flight.id} onClick={async () => {
          const response = await sendMessage(`I would like to choose flight ${flight.id}!`);
          setMessages(msgs => [...msgs, response]);
        }}>
          {flight.name}
        </div>
      ))}
    </div>
  );
}
```

**After (UI):** Initialize `useChat` with same `id` in component
```tsx
// @/app/components/list-flights.tsx
'use client';
export function ListFlights({ chatId, flights }) {
  const { append } = useChat({ id: chatId, body: { id: chatId }, maxSteps: 5 });
  return (
    <div>
      {flights.map(flight => (
        <div key={flight.id} onClick={async () => {
          await append({
            role: 'user',
            content: `I would like to choose flight ${flight.id}!`,
          });
        }}>
          {flight.name}
        </div>
      ))}
    </div>
  );
}
```

### Loading Indicators

**Before (RSC):** Use `initial` parameter in `streamUI`
```tsx
const { value: stream } = await streamUI({
  model: openai('gpt-4o'),
  system: 'you are a friendly assistant!',
  messages,
  initial: <div>Loading...</div>,
  text: async function* ({ content, done }) { /* process text */ },
  tools: { /* tool definitions */ },
});
```

**After (UI):** Use tool invocation state
```tsx
// @/app/components/message.tsx
'use client';
export function Message({ role, content, toolInvocations }) {
  return (
    <div>
      <div>{role}</div>
      <div>{content}</div>
      {toolInvocations && (
        <div>
          {toolInvocations.map(toolInvocation => {
            const { toolName, toolCallId, state } = toolInvocation;
            if (state === 'result') {
              return (
                <div key={toolCallId}>
                  {toolName === 'getWeather' ? (
                    <Weather weatherAtLocation={toolInvocation.result} />
                  ) : null}
                </div>
              );
            } else {
              return (
                <div key={toolCallId}>
                  {toolName === 'getWeather' ? (
                    <Weather isLoading={true} />
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
```

### Saving Chats

**Before (RSC):** Use `onSetAIState` callback in `createAI` context provider
```ts
// @/app/actions.ts
export const AI = createAI({
  initialAIState: {},
  initialUIState: {},
  actions: { /* server actions */ },
  onSetAIState: async ({ state, done }) => {
    'use server';
    if (done) {
      await saveChat(state);
    }
  },
});
```

**After (UI):** Use `onFinish` callback in `streamText`
```ts
// @/app/api/chat/route.ts
export async function POST(request) {
  const { id, messages } = await request.json();
  const coreMessages = convertToModelMessages(messages);
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'you are a friendly assistant!',
    messages: coreMessages,
    onFinish: async ({ response }) => {
      try {
        await saveChat({
          id,
          messages: [...coreMessages, ...response.messages],
        });
      } catch (error) {
        console.error('Failed to save chat');
      }
    },
  });
  return result.toUIMessageStreamResponse();
}
```

### Restoring Chats

**Before (RSC):** Use `onGetUIState` callback in `createAI`
```ts
// @/app/actions.ts
export const AI = createAI({
  actions: { /* server actions */ },
  onGetUIState: async () => {
    'use server';
    const chat = await loadChatFromDB();
    const uiState = convertToUIState(chat);
    return uiState;
  },
});
```

**After (UI):** Load messages during page static generation and pass as `initialMessages`
```tsx
// @/app/chat/[id]/page.tsx
export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const chatFromDb = await getChatById({ id });
  const chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages),
  };
  return <Chat key={id} id={chat.id} initialMessages={chat.messages} />;
}

// @/app/components/chat.tsx
'use client';
export function Chat({ id, initialMessages }: { id; initialMessages: Array<Message> }) {
  const { messages } = useChat({ id, initialMessages });
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
        </div>
      ))}
    </div>
  );
}
```

## Streaming Object Generation

**Before (RSC):** Use `createStreamableValue` with `streamObject`
```ts
// @/app/actions.ts
export async function generateSampleNotifications() {
  'use server';
  const stream = createStreamableValue();
  (async () => {
    const { partialObjectStream } = streamObject({
      model: 'anthropic/claude-sonnet-4.5',
      system: 'generate sample ios messages for testing',
      prompt: 'messages from a family group chat during diwali, max 4',
      schema: notificationsSchema,
    });
    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
  })();
  stream.done();
  return { partialNotificationsStream: stream.value };
}

// @/app/page.tsx
'use client';
export default function Page() {
  const [notifications, setNotifications] = useState(null);
  return (
    <div>
      <button onClick={async () => {
        const { partialNotificationsStream } = await generateSampleNotifications();
        for await (const partialNotifications of readStreamableValue(partialNotificationsStream)) {
          if (partialNotifications) {
            setNotifications(partialNotifications.notifications);
          }
        }
      }}>
        Generate
      </button>
    </div>
  );
}
```

**After (UI):** Use `useObject` hook with `streamObject` in route handler
```ts
// @/app/api/object/route.ts
export async function POST(req: Request) {
  const context = await req.json();
  const result = streamObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: notificationSchema,
    prompt: `Generate 3 notifications for a messages app in this context:` + context,
  });
  return result.toTextStreamResponse();
}

// @/app/page.tsx
'use client';
export default function Page() {
  const { object, submit } = useObject({
    api: '/api/object',
    schema: notificationSchema,
  });
  return (
    <div>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>
      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```