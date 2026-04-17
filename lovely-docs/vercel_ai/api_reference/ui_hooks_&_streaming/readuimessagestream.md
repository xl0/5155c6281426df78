## readUIMessageStream

Transforms a stream of `UIMessageChunk`s into an `AsyncIterableStream` of `UIMessage`s.

Useful for non-Chat use cases like terminal UIs, custom client-side stream consumption, or React Server Components.

### Import
```tsx
import { readUIMessageStream } from 'ai';
```

### Parameters
- `message` (UIMessage, optional): The last assistant message to use as a starting point when resuming conversation. Otherwise undefined.
- `stream` (ReadableStream<UIMessageChunk>): The stream of UIMessageChunk objects to read.
- `onError` ((error: unknown) => void, optional): Called when an error occurs during stream processing.
- `terminateOnError` (boolean, optional): Whether to terminate the stream on error. Defaults to false.

### Returns
An `AsyncIterableStream` of `UIMessage`s. Each stream part represents a different state of the same message as it is being completed.