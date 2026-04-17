## simulateReadableStream()

Creates a ReadableStream that emits provided values sequentially with configurable delays. Useful for testing streaming functionality or simulating time-delayed data streams.

### Parameters

- `chunks` (T[]): Array of values to be emitted by the stream
- `initialDelayInMs` (number | null, optional): Initial delay in milliseconds before emitting the first value. Defaults to 0. Set to null to skip.
- `chunkDelayInMs` (number | null, optional): Delay in milliseconds between emitting each value. Defaults to 0. Set to null to skip.

### Returns

ReadableStream<T> that emits each value from chunks sequentially, respecting the configured delays, and closes automatically after all chunks are emitted.

### Examples

```ts
import { simulateReadableStream } from 'ai';

// Basic usage
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
});

// With delays
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: 1000,
  chunkDelayInMs: 500,
});

// Without delays
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: null,
  chunkDelayInMs: null,
});
```