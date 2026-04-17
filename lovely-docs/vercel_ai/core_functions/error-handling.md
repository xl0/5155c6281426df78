## Error Handling in AI SDK Core

### Regular Errors
Regular errors from functions like `generateText()` are thrown and caught with try/catch:

```ts
import { generateText } from 'ai';

try {
  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
} catch (error) {
  // handle error
}
```

### Streaming Errors (Simple Streams)
Errors during streams without error chunk support are thrown as regular errors:

```ts
try {
  const { textStream } = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });

  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
} catch (error) {
  // handle error
}
```

### Streaming Errors (Full Streams with Error Support)
Full streams support error parts that can be handled within the stream loop:

```ts
try {
  const { fullStream } = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });

  for await (const part of fullStream) {
    switch (part.type) {
      case 'error': {
        const error = part.error;
        // handle error
        break;
      }
      case 'abort': {
        // handle stream abort
        break;
      }
      case 'tool-error': {
        const error = part.error;
        // handle error
        break;
      }
    }
  }
} catch (error) {
  // handle error outside streaming
}
```

### Handling Stream Aborts
Use the `onAbort` callback for cleanup when streams are aborted (e.g., via stop button). The callback receives an array of completed steps and is not called on normal completion:

```ts
const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  onAbort: ({ steps }) => {
    console.log('Stream aborted after', steps.length, 'steps');
  },
  onFinish: ({ steps, totalUsage }) => {
    console.log('Stream completed normally');
  },
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

Alternatively, handle abort events directly in the stream by checking for `chunk.type === 'abort'`.