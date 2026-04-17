**DEPRECATED**: StreamingTextResponse has been removed in AI SDK 4.0. Use `streamText.toDataStreamResponse()` instead.

A utility class that wraps the native Response class to simplify returning a ReadableStream of text in HTTP responses. It automatically sets the status code to 200 and Content-Type header to 'text/plain; charset=utf-8'.

**Import:**
```javascript
import { StreamingTextResponse } from "ai"
```

**Parameters:**
- `stream` (ReadableStream): The stream of content for the HTTP response
- `init` (ResponseInit, optional): Customize HTTP response properties
  - `status` (number, optional): Status code (StreamingTextResponse overwrites to 200)
  - `statusText` (string, optional): Status message
  - `headers` (HeadersInit, optional): Custom headers (Content-Type is automatically set to 'text/plain; charset=utf-8')
- `data` (StreamData, optional): StreamData object for generating additional response data

**Returns:** Response instance with the ReadableStream as body, status 200, and Content-Type header set to 'text/plain; charset=utf-8'