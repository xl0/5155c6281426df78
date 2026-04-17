## Purpose
Executes an Agent and streams its UI message output directly to a Node.js `ServerResponse` object. Designed for building API endpoints in Node.js servers (Express, Hono, custom servers) that need low-latency, real-time UI message streaming from agents for chat or tool-use applications.

## Import
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
```

## Parameters
- `response` (ServerResponse, required): Node.js ServerResponse object to pipe the UI message stream to
- `agent` (Agent, required): Agent instance that implements `.stream({ prompt })` and defines tools
- `messages` (unknown[], required): Array of input UI messages (user and assistant message objects)
- `abortSignal` (AbortSignal, optional): Signal to cancel streaming when client disconnects or timeout occurs
- `...options` (UIMessageStreamResponseInit & UIMessageStreamOptions, optional): Response headers, status, and streaming configuration

## Returns
Promise<void> that resolves when piping is complete.

## Usage Example
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
import { openaiWebSearchAgent } from './openai-web-search-agent';

app.post('/chat', async (req, res) => {
  const { messages } = await getJsonBody(req);
  const abortController = new AbortController();

  await pipeAgentUIStreamToResponse({
    response: res,
    agent: openaiWebSearchAgent,
    messages,
    abortSignal: abortController.signal,
    // status: 200,
    // headers: { 'X-Custom': 'foo' },
  });
});
```

## How It Works
1. Creates a UI message stream from the agent and pipes it to the ServerResponse with appropriate HTTP headers and status
2. Supports abort signal for cancellation, improving resource usage when clients disconnect
3. Writes streaming bytes directly to Node.js response (more memory and latency efficient than returning Response objects)

## Key Notes
- **Node.js only**: For Node.js environments with ServerResponse access, not for Edge/serverless/web Response APIs
- **Abort support**: Use abortSignal to stop processing early; tie to server disconnect/timeout events when possible
- **Streaming infrastructure**: Ensure client and reverse proxy support streaming HTTP responses
- **Framework support**: Works with Hono (@hono/node-server), Express, and similar Node.js frameworks

## Related
- createAgentUIStreamResponse
- Agent
- UIMessageStreamOptions
- UIMessage