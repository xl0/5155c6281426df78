## Rendering User Interfaces with Language Models

Language models generate text, but you can render React components by having tools return JSON objects instead of text strings.

### Basic Pattern

Instead of returning text from a tool:
```tsx
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return `It is currently ${weather.value}°${unit}...`;
}
```

Return a JSON object:
```tsx
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return { temperature, unit, description, forecast };
}
```

Then render components on the client based on the tool response:
```tsx
{messages.map(message => {
  if (message.role === 'function') {
    const { temperature, unit, description, forecast } = message.content;
    return <WeatherCard weather={{ temperature, unit, description, forecast }} />;
  }
})}
```

### Managing Multiple Tools

As applications grow with multiple tools (search courses, search people, meetings, buildings, events, meals), client-side conditional rendering becomes complex with nested ternaries.

### Server-Side Rendering with RSC

The `@ai-sdk/rsc` module provides `createStreamableUI()` to render React components on the server and stream them to the client, eliminating client-side conditional logic.

```tsx
import { createStreamableUI } from '@ai-sdk/rsc';

const uiStream = createStreamableUI();

const text = generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'you are a friendly assistant',
  prompt: 'what is the weather in SF?',
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for'),
        unit: z.enum(['C', 'F']).describe('The unit to display the temperature in')
      }),
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit });
        uiStream.done(
          <WeatherCard weather={{ temperature: 47, unit: 'F', description: 'sunny', forecast }} />
        );
      }
    }
  }
});

return { display: uiStream.value };
```

On the client, simply render the streamed UI:
```tsx
{messages.map(message => (
  <div>{message.display}</div>
))}
```

This simplifies the flow: user prompt → model generates tool call → tool renders component → stream to client → client renders directly.