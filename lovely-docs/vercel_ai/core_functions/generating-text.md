## Text Generation Functions

The AI SDK Core provides two main functions for generating text from LLMs:

### `generateText`
Generates complete text for a given prompt and model. Ideal for non-interactive use cases (drafting emails, summarizing documents) and agents using tools.

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});

// With system prompt
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You are a professional writer. You write simple, clear, and concise content.',
  prompt: `Summarize the following article in 3-5 sentences: ${article}`,
});
```

Result object properties: `content`, `text`, `reasoning`, `reasoningText`, `files`, `sources`, `toolCalls`, `toolResults`, `finishReason`, `usage`, `totalUsage`, `warnings`, `request`, `response`, `providerMetadata`, `steps`, `output`.

Access response headers and body via `result.response.headers` and `result.response.body`.

`onFinish` callback triggered after completion with text, usage, finish reason, messages, steps, total usage:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
    // save chat history, record usage, etc.
    const messages = response.messages;
  },
});
```

### `streamText`
Streams text from LLMs for interactive use cases (chatbots, real-time applications). Starts immediately and suppresses errors to prevent crashes.

```ts
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

// textStream is both ReadableStream and AsyncIterable
for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

Helper functions: `toUIMessageStreamResponse()`, `pipeUIMessageStreamToResponse()`, `toTextStreamResponse()`, `pipeTextStreamToResponse()`.

Result promises (resolve when stream finishes): `content`, `text`, `reasoning`, `reasoningText`, `files`, `sources`, `toolCalls`, `toolResults`, `finishReason`, `usage`, `totalUsage`, `warnings`, `steps`, `request`, `response`, `providerMetadata`.

Uses backpressure—only generates tokens as requested. Must consume stream for it to finish.

`onError` callback for error logging (errors become part of stream, not thrown):
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error);
  },
});
```

`onChunk` callback triggered for each stream chunk (types: `text`, `reasoning`, `source`, `tool-call`, `tool-input-start`, `tool-input-delta`, `tool-result`, `raw`):
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onChunk({ chunk }) {
    if (chunk.type === 'text') {
      console.log(chunk.text);
    }
  },
});
```

`onFinish` callback when stream completes:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
    // save chat history, record usage, etc.
    const messages = response.messages;
  },
});
```

### `fullStream` Property
Read all stream events with `result.fullStream`. Event types: `start`, `start-step`, `text-start`, `text-delta`, `text-end`, `reasoning-start`, `reasoning-delta`, `reasoning-end`, `source`, `file`, `tool-call`, `tool-input-start`, `tool-input-delta`, `tool-input-end`, `tool-result`, `tool-error`, `finish-step`, `finish`, `error`, `raw`.

```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    cityAttractions: {
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({
        attractions: ['attraction1', 'attraction2', 'attraction3'],
      }),
    },
  },
  prompt: 'What are some San Francisco tourist attractions?',
});

for await (const part of result.fullStream) {
  switch (part.type) {
    case 'text-delta': {
      // handle text delta
      break;
    }
    case 'tool-call': {
      switch (part.toolName) {
        case 'cityAttractions': {
          // handle tool call
          break;
        }
      }
      break;
    }
    case 'tool-result': {
      switch (part.toolName) {
        case 'cityAttractions': {
          // handle tool result
          break;
        }
      }
      break;
    }
    // ... other cases
  }
}
```

### Stream Transformation
Use `experimental_transform` option to filter, change, or smooth text streams. Transformations applied before callbacks and promise resolution.

`smoothStream` function available for smoothing text streaming:
```ts
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

Custom transformations receive tools and return a TransformStream:
```ts
const upperCaseTransform =
  <TOOLS extends ToolSet>() =>
  (options: { tools: TOOLS; stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        controller.enqueue(
          chunk.type === 'text'
            ? { ...chunk, text: chunk.text.toUpperCase() }
            : chunk,
        );
      },
    });
```

Stop stream using `stopStream()` function. Must simulate `finish-step` and `finish` events to ensure well-formed stream and callback invocation:
```ts
const stopWordTransform =
  <TOOLS extends ToolSet>() =>
  ({ stopStream }: { stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        if (chunk.type !== 'text') {
          controller.enqueue(chunk);
          return;
        }

        if (chunk.text.includes('STOP')) {
          stopStream();
          controller.enqueue({
            type: 'finish-step',
            finishReason: 'stop',
            logprobs: undefined,
            usage: { completionTokens: NaN, promptTokens: NaN, totalTokens: NaN },
            request: {},
            response: { id: 'response-id', modelId: 'mock-model-id', timestamp: new Date(0) },
            warnings: [],
            isContinued: false,
          });
          controller.enqueue({
            type: 'finish',
            finishReason: 'stop',
            logprobs: undefined,
            usage: { completionTokens: NaN, promptTokens: NaN, totalTokens: NaN },
            response: { id: 'response-id', modelId: 'mock-model-id', timestamp: new Date(0) },
          });
          return;
        }

        controller.enqueue(chunk);
      },
    });
```

Multiple transformations applied in order:
```ts
const result = streamText({
  model,
  prompt,
  experimental_transform: [firstTransform, secondTransform],
});
```

### Sources
Some providers (Perplexity, Google Generative AI) include sources in responses. Currently limited to web pages grounding the response.

Source properties: `id`, `url`, `title` (optional), `providerMetadata`.

With `generateText`:
```ts
const result = await generateText({
  model: 'google/gemini-2.5-flash',
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  prompt: 'List the top 5 San Francisco news from the past week.',
});

for (const source of result.sources) {
  if (source.sourceType === 'url') {
    console.log('ID:', source.id);
    console.log('Title:', source.title);
    console.log('URL:', source.url);
    console.log('Provider metadata:', source.providerMetadata);
  }
}
```

With `streamText` via `fullStream`:
```ts
const result = streamText({
  model: 'google/gemini-2.5-flash',
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  prompt: 'List the top 5 San Francisco news from the past week.',
});

for await (const part of result.fullStream) {
  if (part.type === 'source' && part.sourceType === 'url') {
    console.log('ID:', part.id);
    console.log('Title:', part.title);
    console.log('URL:', part.url);
    console.log('Provider metadata:', part.providerMetadata);
  }
}
```

Sources also available in `result.sources` promise.