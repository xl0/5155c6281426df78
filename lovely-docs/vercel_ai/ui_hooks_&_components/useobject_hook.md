## useObject Hook

The `useObject` hook enables streaming structured JSON object generation in React, Svelte, and Vue applications. It pairs with the server-side `streamObject` function to progressively render partially-generated objects.

### Basic Usage

Define a Zod schema:
```ts
import { z } from 'zod';
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string().describe('Name of a fictional person.'),
      message: z.string().describe('Message. Do not use emojis or links.'),
    }),
  ),
});
```

Client-side streaming with partial results:
```tsx
import { experimental_useObject as useObject } from '@ai-sdk/react';

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });

  return (
    <>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>
      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

Server-side streaming:
```ts
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';

export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();
  const result = streamObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: notificationSchema,
    prompt: `Generate 3 notifications for a messages app in this context: ${context}`,
  });
  return result.toTextStreamResponse();
}
```

### Enum Output Mode

For classification into predefined options, use `enum` output mode with schema structure `{ enum: z.enum(['option1', 'option2']) }`:

```tsx
const { object, submit, isLoading } = useObject({
  api: '/api/classify',
  schema: z.object({ enum: z.enum(['true', 'false']) }),
});

return (
  <>
    <button onClick={() => submit('The earth is flat')} disabled={isLoading}>
      Classify statement
    </button>
    {object && <div>Classification: {object.enum}</div>}
  </>
);
```

Server with `output: 'enum'`:
```ts
const result = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['true', 'false'],
  prompt: `Classify this statement as true or false: ${context}`,
});
```

### State Management

`useObject` returns:
- `object`: Partial or complete generated object
- `isLoading`: Boolean indicating generation in progress
- `error`: Error object if fetch fails
- `submit(input)`: Function to trigger generation
- `stop()`: Function to cancel generation

```tsx
const { isLoading, error, object, submit, stop } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
});

return (
  <>
    {isLoading && <Spinner />}
    {error && <div>An error occurred.</div>}
    {isLoading && <button onClick={() => stop()}>Stop</button>}
    <button onClick={() => submit('...')} disabled={isLoading}>
      Generate
    </button>
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

### Event Callbacks

```tsx
const { object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
  onFinish({ object, error }) {
    console.log('Object generation completed:', object);
    console.log('Schema validation error:', error);
  },
  onError(error) {
    console.error('An error occurred:', error);
  },
});
```

### Configuration

```tsx
const { submit, object } = useObject({
  api: '/api/use-object',
  headers: { 'X-Custom-Header': 'CustomValue' },
  credentials: 'include',
  schema: yourSchema,
});
```