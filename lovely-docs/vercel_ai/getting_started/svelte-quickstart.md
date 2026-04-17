## Svelte Quickstart for AI SDK

Build a streaming chat interface with Svelte using the AI SDK and Vercel AI Gateway.

### Prerequisites
- Node.js 18+, pnpm
- Vercel AI Gateway API key

### Setup
```bash
npx sv create my-ai-app
cd my-ai-app
pnpm add -D ai@beta @ai-sdk/svelte@beta zod
```

Create `.env.local`:
```env
AI_GATEWAY_API_KEY=your_key
```

### API Route (`src/routes/api/chat/+server.ts`)
```ts
import { streamText, convertToModelMessages, createGateway } from 'ai';
import { AI_GATEWAY_API_KEY } from '$env/static/private';

const gateway = createGateway({ apiKey: AI_GATEWAY_API_KEY });

export async function POST({ request }) {
  const { messages } = await request.json();
  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4.5'),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

Key concepts:
- `createGateway()` creates provider instance
- `streamText()` streams model responses
- `convertToModelMessages()` converts UIMessage[] to ModelMessage[] (strips metadata)
- `toUIMessageStreamResponse()` converts result to streamed response

### UI Component (`src/routes/+page.svelte`)
```svelte
<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  let input = '';
  const chat = new Chat({});
  
  function handleSubmit(event) {
    event.preventDefault();
    chat.sendMessage({ text: input });
    input = '';
  }
</script>

<main>
  <ul>
    {#each chat.messages as message}
      <li>
        <div>{message.role}</div>
        {#each message.parts as part}
          {#if part.type === 'text'}
            <div>{part.text}</div>
          {/if}
        {/each}
      </li>
    {/each}
  </ul>
  <form onsubmit={handleSubmit}>
    <input bind:value={input} />
    <button type="submit">Send</button>
  </form>
</main>
```

Chat class provides:
- `messages` - array of message objects with `id`, `role`, `parts`
- `sendMessage()` - send message to API
- Message parts preserve sequence of model outputs (text, reasoning, etc.)

### Tools

Define tools in API route:
```ts
const result = streamText({
  model: gateway('anthropic/claude-sonnet-4.5'),
  messages: convertToModelMessages(messages),
  tools: {
    weather: tool({
      description: 'Get weather in location (fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('Location'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert fahrenheit to celsius',
      inputSchema: z.object({
        temperature: z.number().describe('Temperature in fahrenheit'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
});
```

Tool parts are named `tool-{toolName}` and appear in `message.parts`.

### Multi-Step Tool Calls

Enable model to use tool results to generate follow-up responses:
```ts
const result = streamText({
  model: gateway('anthropic/claude-sonnet-4.5'),
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),  // Allow up to 5 steps
  tools: { /* ... */ },
});
```

Update UI to display tool parts:
```svelte
{#if part.type === 'text'}
  <div>{part.text}</div>
{:else if part.type === 'tool-weather' || part.type === 'tool-convertFahrenheitToCelsius'}
  <pre>{JSON.stringify(part, null, 2)}</pre>
{/if}
```

### Svelte vs React Differences

1. **State management**: Svelte uses classes (Chat) vs React hooks (useChat)
2. **Reactivity**: Arguments to classes aren't reactive by default - pass references:
```svelte
let chat = new Chat({
  get id() { return id; }  // reactive
});
```
3. **Destructuring**: Destructuring class properties copies by value, disconnecting from instance
4. **Synchronization**: Use `createAIContext()` in root layout for instance synchronization across components

### Running
```bash
pnpm run dev
# Open http://localhost:5173
```