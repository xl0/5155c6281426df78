## Setup

Prerequisites: Node.js 18+, pnpm, Vercel AI Gateway API key.

Create project:
```bash
mkdir my-ai-app && cd my-ai-app && pnpm init
pnpm add ai@beta zod dotenv
pnpm add -D @types/node tsx typescript
```

Create `.env`:
```env
AI_GATEWAY_API_KEY=your_key
```

## Basic Chat Agent

Create `index.ts`:
```ts
import { ModelMessage, streamText } from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: ModelMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');
    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      messages,
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);
```

Run with `pnpm tsx index.ts`. The code uses `streamText()` to stream responses, maintains message history for context, and iterates over `result.textStream` to print tokens in real-time.

## Provider Configuration

Default provider is Vercel AI Gateway. Access models with string: `model: 'anthropic/claude-sonnet-4.5'`

Equivalent explicit imports:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');

// or
import { gateway } from '@ai-sdk/gateway';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers (e.g., OpenAI):
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## Tools

Tools allow LLMs to invoke actions and receive results. Add tools to `streamText()`:

```ts
import { tool } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
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
  },
});
```

Tool definition requires: description (when to use), inputSchema (Zod schema for parameters), execute (async function that runs on server).

Access tool calls and results:
```ts
console.log(await result.toolCalls);
console.log(await result.toolResults);
```

## Multi-Step Tool Calls

Enable agent to use tool results to answer questions with `stopWhen` and `onStepFinish`:

```ts
import { stepCountIs } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
  tools: { /* ... */ },
  stopWhen: stepCountIs(5),
  onStepFinish: async ({ toolResults }) => {
    if (toolResults.length) {
      console.log(JSON.stringify(toolResults, null, 2));
    }
  },
});
```

`stopWhen: stepCountIs(5)` allows up to 5 steps. Agent can call multiple tools sequentially. Example with two tools:

```ts
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

Query "What's the weather in New York in celsius?" triggers: weather tool call → temperature conversion tool call → natural language response.