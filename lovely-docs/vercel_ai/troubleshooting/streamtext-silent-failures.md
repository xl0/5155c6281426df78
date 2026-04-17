## streamText Silent Failures

`streamText` starts streaming immediately without waiting for the model, which means errors become part of the stream rather than being thrown. This prevents server crashes but can make debugging difficult since errors won't surface as exceptions.

To capture and log errors, use the `onError` callback:

```tsx
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error); // your error logging logic here
  },
});
```

The stream will only contain error parts if something goes wrong, so monitoring the `onError` callback is essential for troubleshooting.