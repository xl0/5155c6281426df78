## validateUIMessages

Async function that validates UI messages against schemas for metadata, data parts, and tools. Ensures type safety and data integrity for message arrays before processing or rendering.

### Basic Usage

```typescript
import { validateUIMessages } from 'ai';

const messages = [
  {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'Hello!' }],
  },
];

const validatedMessages = await validateUIMessages({ messages });
```

### Advanced Usage with Custom Schemas

```typescript
import { validateUIMessages, tool } from 'ai';
import { z } from 'zod';

const metadataSchema = z.object({
  timestamp: z.string().datetime(),
  userId: z.string(),
});

const dataSchemas = {
  chart: z.object({
    data: z.array(z.number()),
    labels: z.array(z.string()),
  }),
  image: z.object({
    url: z.string().url(),
    caption: z.string(),
  }),
};

const tools = {
  weather: tool({
    description: 'Get weather info',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => `Weather in ${location}: sunny`,
  }),
};

const messages = [
  {
    id: '1',
    role: 'user',
    metadata: { timestamp: '2024-01-01T00:00:00Z', userId: 'user123' },
    parts: [
      { type: 'text', text: 'Show me a chart' },
      { type: 'data-chart', data: { data: [1, 2, 3], labels: ['A', 'B', 'C'] } },
    ],
  },
  {
    id: '2',
    role: 'assistant',
    parts: [
      {
        type: 'tool-weather',
        toolCallId: 'call_123',
        state: 'output-available',
        input: { location: 'San Francisco' },
        output: 'Weather in San Francisco: sunny',
      },
    ],
  },
];

const validatedMessages = await validateUIMessages({
  messages,
  metadataSchema,
  dataSchemas,
  tools,
});
```

Accepts optional `metadataSchema`, `dataSchemas`, and `tools` parameters to validate corresponding message properties against Zod schemas.