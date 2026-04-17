## Reading UIMessage Streams

`readUIMessageStream` transforms a stream of `UIMessageChunk` objects into an `AsyncIterableStream` of `UIMessage` objects, enabling message processing as they're constructed. Useful for terminal UIs, custom client-side stream processing, and React Server Components.

### Basic Usage

```tsx
import { openai } from '@ai-sdk/openai';
import { readUIMessageStream, streamText } from 'ai';

async function main() {
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a short story about a robot.',
  });

  for await (const uiMessage of readUIMessageStream({
    stream: result.toUIMessageStream(),
  })) {
    console.log('Current message state:', uiMessage);
  }
}
```

### Tool Calls Integration

Handle streaming responses with tool calls by iterating over `uiMessage.parts` and switching on `part.type`:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt: 'What is the weather in Tokyo?',
});

for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
})) {
  uiMessage.parts.forEach(part => {
    switch (part.type) {
      case 'text':
        console.log('Text:', part.text);
        break;
      case 'tool-call':
        console.log('Tool called:', part.toolName, 'with args:', part.args);
        break;
      case 'tool-result':
        console.log('Tool result:', part.result);
        break;
    }
  });
}
```

### Resuming Conversations

Resume streaming from a previous message state by passing the `message` parameter:

```tsx
for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
  message: lastMessage, // Resume from this message
})) {
  console.log('Resumed message:', uiMessage);
}
```