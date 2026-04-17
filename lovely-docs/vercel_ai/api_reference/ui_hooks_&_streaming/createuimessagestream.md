## createUIMessageStream

Creates a readable stream for UI messages with message merging, error handling, and finish callbacks.

### Import
```tsx
import { createUIMessageStream } from "ai"
```

### Example
```tsx
const stream = createUIMessageStream({
  async execute({ writer }) {
    // Write individual message chunks
    writer.write({ type: 'text-start', id: 'example-text' });
    writer.write({ type: 'text-delta', id: 'example-text', delta: 'Hello' });
    writer.write({ type: 'text-end', id: 'example-text' });

    // Merge another stream
    const result = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      prompt: 'Write a haiku about AI',
    });
    writer.merge(result.toUIMessageStream());
  },
  onError: error => `Custom error: ${error.message}`,
  originalMessages: existingMessages,
  onFinish: ({ messages, isContinuation, responseMessage }) => {
    console.log('Stream finished with messages:', messages);
  },
});
```

### Parameters

- **execute**: `(options: { writer: UIMessageStreamWriter }) => Promise<void> | void` - Function receiving a writer instance to write UI message chunks
  - **writer.write**: `(part: UIMessageChunk) => void` - Writes a UI message chunk to the stream
  - **writer.merge**: `(stream: ReadableStream<UIMessageChunk>) => void` - Merges another UI message stream into this stream
  - **writer.onError**: `(error: unknown) => string` - Error handler for merged streams

- **onError**: `(error: unknown) => string` - Handles errors and returns error message string (default returns error message)

- **originalMessages**: `UIMessage[] | undefined` - Original messages; if provided, enables persistence mode with message ID for response message

- **onFinish**: `(options: { messages: UIMessage[]; isContinuation: boolean; responseMessage: UIMessage }) => void | undefined` - Callback when stream finishes
  - **messages**: `UIMessage[]` - Updated list of UI messages
  - **isContinuation**: `boolean` - Whether response message continues last original message or creates new one
  - **responseMessage**: `UIMessage` - Message sent to client as response

- **generateId**: `IdGenerator | undefined` - Function to generate unique message IDs (uses default if not provided)

### Returns

`ReadableStream<UIMessageChunk>` - Readable stream emitting UI message chunks with automatic error propagation, stream merging, and cleanup.