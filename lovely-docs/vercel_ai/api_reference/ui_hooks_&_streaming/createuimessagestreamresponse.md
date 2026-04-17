## Purpose
Creates a Response object that streams UI messages to the client, allowing you to send structured data, text content, source information, and LLM streams in a single response.

## Parameters
- `stream` (required): ReadableStream<UIMessageChunk> - The UI message stream to send
- `status` (optional): number - HTTP status code, defaults to 200
- `statusText` (optional): string - HTTP status text
- `headers` (optional): Headers | Record<string, string> - Additional response headers
- `consumeSseStream` (optional): callback function to consume the Server-Sent Events stream

## Returns
Response object that streams UI message chunks with specified status, headers, and content.

## Example
```tsx
import { createUIMessageStream, createUIMessageStreamResponse, streamText } from 'ai';

const response = createUIMessageStreamResponse({
  status: 200,
  statusText: 'OK',
  headers: { 'Custom-Header': 'value' },
  stream: createUIMessageStream({
    execute({ writer }) {
      // Write custom data
      writer.write({ type: 'data', value: { message: 'Hello' } });
      
      // Write text content
      writer.write({ type: 'text', value: 'Hello, world!' });
      
      // Write source information
      writer.write({
        type: 'source-url',
        value: {
          type: 'source',
          id: 'source-1',
          url: 'https://example.com',
          title: 'Example Source',
        },
      });
      
      // Merge with LLM stream
      const result = streamText({
        model: 'anthropic/claude-sonnet-4.5',
        prompt: 'Say hello',
      });
      writer.merge(result.toUIMessageStream());
    },
  }),
});
```