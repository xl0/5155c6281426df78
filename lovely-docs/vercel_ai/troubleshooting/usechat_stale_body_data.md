## Problem
When passing dynamic information via the `body` parameter to `useChat`, the data becomes stale because the body configuration is captured once during hook initialization and doesn't update with component re-renders.

```tsx
// Problematic - body values stay at initial render
const [temperature, setTemperature] = useState(0.7);
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: { temperature }, // Always 0.7, never updates
  }),
});
```

## Solution 1: Request-level options (recommended)
Pass dynamic values as the second argument to `sendMessage` instead of hook-level configuration. Request-level options are evaluated on each call and take precedence.

```tsx
const [temperature, setTemperature] = useState(0.7);
const [userId, setUserId] = useState('user123');
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

sendMessage(
  { text: input },
  {
    body: {
      temperature, // Current value at request time
      userId,
    },
  },
);
```

## Solution 2: Hook-level with functions and refs
If hook-level configuration is needed, use functions that return values. For component state, access current values via `useRef`:

```tsx
const temperatureRef = useRef(0.7);
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: () => ({
      temperature: temperatureRef.current,
      sessionId: getCurrentSessionId(),
    }),
  }),
});
```

## Server-side handling
Destructure custom fields from the request body:

```tsx
export async function POST(req: Request) {
  const { messages, temperature, userId } = await req.json();
  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
    temperature,
  });
  return result.toUIMessageStreamResponse();
}
```