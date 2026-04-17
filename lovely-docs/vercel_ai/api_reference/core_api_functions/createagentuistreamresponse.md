## Purpose
Executes an Agent and streams its output as a UI message stream in an HTTP Response body. Designed for building API endpoints that deliver real-time streaming results from agents (chat, tool-use applications).

## Import
```ts
import { createAgentUIStreamResponse } from "ai"
```

## Parameters
- `agent` (required): Agent instance with `.stream({ prompt })` method and defined tools
- `messages` (required): Array of input UI messages (user and assistant message objects)
- `abortSignal` (optional): AbortSignal for cancellation on client disconnect
- `...options` (optional): UIMessageStreamOptions like `sendSources`, `includeUsage`, `experimental_transform`

## Returns
`Promise<Response>` with streaming UI messages in body, suitable for HTTP API routes.

## Usage Examples

**Next.js API Route:**
```ts
import { createAgentUIStreamResponse } from 'ai';
import { ToolLoopAgent } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
});

export async function POST(request: Request) {
  const { messages } = await request.json();
  const abortController = new AbortController();

  return createAgentUIStreamResponse({
    agent,
    messages,
    abortSignal: abortController.signal,
    sendSources: true,
    includeUsage: true,
  });
}
```

## How It Works
1. Validates and normalizes incoming messages array
2. Transforms messages to internal model format
3. Calls agent's `.stream({ prompt })` method
4. Returns stream of UI message chunks as HTTP Response

## Important Notes
- Agent must define `tools` and implement `.stream({ prompt })`
- Server-side only, not for browser use
- Supports Readable Streams for HTTP consumption
- Can customize with UIMessageStreamOptions including experimental transforms