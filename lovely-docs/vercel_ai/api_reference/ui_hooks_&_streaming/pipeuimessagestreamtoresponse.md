## Purpose
Pipes streaming UI message data to a Node.js ServerResponse object for server-side streaming responses.

## Usage
```tsx
import { pipeUIMessageStreamToResponse } from "ai";

pipeUIMessageStreamToResponse({
  response: serverResponse,
  status: 200,
  statusText: 'OK',
  headers: {
    'Custom-Header': 'value',
  },
  stream: myUIMessageStream,
  consumeSseStream: ({ stream }) => {
    console.log('Consuming SSE stream:', stream);
  },
});
```

## Parameters
- `response` (ServerResponse): Node.js ServerResponse object to pipe data to
- `stream` (ReadableStream<UIMessageChunk>): The UI message stream to pipe
- `status` (number): HTTP status code for the response
- `statusText` (string): HTTP status text for the response
- `headers` (Headers | Record<string, string>): Additional response headers
- `consumeSseStream` (optional function): Callback to independently consume the SSE stream; receives a teed copy of the stream