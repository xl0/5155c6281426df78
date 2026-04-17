## Model Context Protocol (MCP) Tools

Connect to MCP servers to access their tools, resources, and prompts through a standardized interface.

### Initializing an MCP Client

Three transport options available:

**HTTP Transport (Recommended for production)**
```typescript
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'https://your-server.com/mcp',
    headers: { Authorization: 'Bearer my-api-key' },
    authProvider: myOAuthClientProvider, // optional
  },
});
```

Or using MCP's official SDK:
```typescript
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const mcpClient = await createMCPClient({
  transport: new StreamableHTTPClientTransport(
    new URL('https://your-server.com/mcp'),
    { sessionId: 'session_123' }
  ),
});
```

**SSE Transport (Alternative HTTP-based)**
```typescript
const mcpClient = await createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://my-server.com/sse',
    headers: { Authorization: 'Bearer my-api-key' },
    authProvider: myOAuthClientProvider,
  },
});
```

**Stdio Transport (Local servers only)**
```typescript
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const mcpClient = await createMCPClient({
  transport: new StdioClientTransport({
    command: 'node',
    args: ['src/stdio/dist/server.js'],
  }),
});
```

You can also implement custom transport via `MCPTransport` interface.

### Closing the MCP Client

For short-lived usage, close when response finishes:
```typescript
const result = await streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: await mcpClient.tools(),
  prompt: 'What is the weather in Brooklyn, New York?',
  onFinish: async () => {
    await mcpClient.close();
  },
});
```

For long-running clients, use try/finally:
```typescript
let mcpClient: MCPClient | undefined;
try {
  mcpClient = await experimental_createMCPClient({ /* ... */ });
} finally {
  await mcpClient?.close();
}
```

### Using MCP Tools

**Schema Discovery** - Automatically list all server tools:
```typescript
const tools = await mcpClient.tools();
```

**Schema Definition** - Explicit type-safe tool definitions:
```typescript
import { z } from 'zod';

const tools = await mcpClient.tools({
  schemas: {
    'get-data': {
      inputSchema: z.object({
        query: z.string().describe('The data query'),
        format: z.enum(['json', 'text']).optional(),
      }),
    },
    'tool-with-no-args': {
      inputSchema: z.object({}),
    },
  },
});
```

### Using MCP Resources

Resources are application-driven data sources providing context to the model.

```typescript
// List all resources
const resources = await mcpClient.listResources();

// Read specific resource by URI
const resourceData = await mcpClient.readResource({
  uri: 'file:///example/document.txt',
});

// List resource templates (dynamic URI patterns)
const templates = await mcpClient.listResourceTemplates();
```

### Using MCP Prompts

Prompts are user-controlled templates servers expose.

```typescript
// List all prompts
const prompts = await mcpClient.listPrompts();

// Get prompt with optional arguments
const prompt = await mcpClient.getPrompt({
  name: 'code_review',
  arguments: { code: 'function add(a, b) { return a + b; }' },
});
```

### Handling Elicitation Requests

Elicitation allows MCP servers to request additional information from the client during tool execution.

Enable elicitation capability:
```typescript
const mcpClient = await experimental_createMCPClient({
  transport: { type: 'sse', url: 'https://your-server.com/sse' },
  capabilities: { elicitation: {} },
});
```

Register handler:
```typescript
import { ElicitationRequestSchema } from '@ai-sdk/mcp';

mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {
  // request.params.message: description of needed input
  // request.params.requestedSchema: JSON schema for expected input

  const userInput = await getInputFromUser(
    request.params.message,
    request.params.requestedSchema,
  );

  return {
    action: 'accept', // or 'decline' or 'cancel'
    content: userInput, // required for 'accept'
  };
});
```

**Note:** The lightweight MCP client from `experimental_createMCPClient` doesn't support session management, resumable streams, or notifications. OAuth authorization is supported via `authProvider` on HTTP/SSE transports.