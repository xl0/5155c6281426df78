## Generative User Interfaces

Language models can render user interfaces as part of their generations, creating non-deterministic but predictable experiences through function calling.

### Deterministic Routes via Function Calling

Language models can be constrained to deterministic outputs by providing function definitions. The model either executes the most relevant function or executes none if the query is out of bounds.

Example: Weather assistant with function calling
```tsx
const sendMessage = (prompt: string) =>
  generateText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'you are a friendly weather assistant!',
    prompt,
    tools: {
      getWeather: {
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      },
    },
  });

sendMessage('What is the weather in San Francisco?'); // getWeather is called
sendMessage('What is the weather in New York?'); // getWeather is called
sendMessage('What events are happening in London?'); // No function is called
```

This ability to reason about which function to execute is an emergent capability that enables models to act as routers.

### Language Models as Routers

Instead of developers managing explicit routing logic (like `/login`, `/user/john`, `/api/events?limit=5`), language models can decide which UI to render based on user state and intent, enabling conversational navigation.

**Routing by parameters**: Models generate correct parameters for dynamic routes. Example: In a search app, ask the model to search for artworks by different artists—it calls the search function with the artist name and renders results.

**Routing by sequence**: Models execute sequences of function calls to complete multi-step tasks. Example: In a calendar app, ask to schedule a happy hour with friends. The model:
1. Looks up your calendar
2. Looks up friends' calendars
3. Determines best time
4. Searches for nearby happy hour spots
5. Creates event and sends invites

By defining functions for lookups, calendar pulls, and location searches, the model sequentially navigates routes automatically. Use `streamUI` to stream generative UIs to the client based on model responses.