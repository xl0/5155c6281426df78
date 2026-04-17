## Setup

Create a Nuxt app with `pnpm create nuxt my-ai-app`, then install dependencies:
```
pnpm add ai@beta @ai-sdk/vue@beta zod
```

Configure API key in `.env`:
```env
NUXT_AI_GATEWAY_API_KEY=your_key
```

And in `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    aiGatewayApiKey: '',
  },
});
```

## API Route

Create `server/api/chat.ts`:
```typescript
import { streamText, UIMessage, convertToModelMessages, createGateway } from 'ai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().aiGatewayApiKey;
  if (!apiKey) throw new Error('Missing AI Gateway API key');
  const gateway = createGateway({ apiKey });

  return defineEventHandler(async (event: any) => {
    const { messages }: { messages: UIMessage[] } = await readBody(event);
    const result = streamText({
      model: gateway('anthropic/claude-sonnet-4.5'),
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  });
});
```

Key points:
- `createGateway()` creates a provider instance
- Extract `messages` from request body (UIMessage[] type with metadata)
- `streamText()` accepts model and messages, returns StreamTextResult
- `convertToModelMessages()` strips UI metadata to convert UIMessage[] to ModelMessage[]
- `toUIMessageStreamResponse()` converts result to streamed response

## UI Component

Create `pages/index.vue`:
```typescript
<script setup lang="ts">
import { Chat } from "@ai-sdk/vue";
import { ref } from "vue";

const input = ref("");
const chat = new Chat({});

const handleSubmit = (e: Event) => {
    e.preventDefault();
    chat.sendMessage({ text: input.value });
    input.value = "";
};
</script>

<template>
    <div>
        <div v-for="(m, index) in chat.messages" :key="m.id ? m.id : index">
            {{ m.role === "user" ? "User: " : "AI: " }}
            <div v-for="(part, index) in m.parts" :key="`${m.id}-${part.type}-${index}`">
                <div v-if="part.type === 'text'">{{ part.text }}</div>
            </div>
        </div>
        <form @submit="handleSubmit">
            <input v-model="input" placeholder="Say something..." />
        </form>
    </div>
</template>
```

Chat hook provides:
- `messages` - array of objects with `id`, `role`, `parts` properties
- `sendMessage()` - function to send message to API
- Message `parts` array contains ordered components (text, reasoning, etc.) in generation order

Run with `pnpm run dev` and visit http://localhost:3000.

## Tools

Add tools to `streamText()` config:
```typescript
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
}
```

Tool parts appear in message.parts as `tool-{toolName}`. Update UI to display them:
```typescript
<pre v-if="part.type === 'tool-weather' || part.type === 'tool-convertFahrenheitToCelsius'">
  {{ JSON.stringify(part, null, 2) }}
</pre>
```

## Multi-Step Tool Calls

Enable with `stopWhen: stepCountIs(5)` in `streamText()` config. This allows the model to use tool results to generate follow-up responses across multiple steps (up to 5 in this example), enabling complex interactions where the model gathers information and uses it to answer the original query.

## Provider Options

Default uses Vercel AI Gateway via string: `model: 'anthropic/claude-sonnet-4.5'`

Or explicitly:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

For other providers like OpenAI:
```
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```