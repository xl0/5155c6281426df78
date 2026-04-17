## Overview
Creates a lightweight Model Context Protocol (MCP) client for connecting to MCP servers. Provides automatic tool conversion, resource management, prompt handling, and elicitation support.

## Configuration
The client accepts `MCPClientConfig` with:
- **transport**: Message transport layer - either `MCPTransport` (custom/stdio) or `MCPTransportConfig` (SSE/HTTP with optional OAuth)
- **name**: Client identifier (defaults to "ai-sdk-mcp-client")
- **onUncaughtError**: Error handler callback
- **capabilities**: Optional client capabilities (e.g., `{ elicitation: {} }` to handle server elicitation requests)

## Methods

**tools(options?)**: Retrieves tools from MCP server with optional schema definitions for type checking.

**listResources(options?)**: Lists available resources with optional pagination and request options.

**readResource({ uri, options? })**: Reads resource contents by URI.

**listResourceTemplates(options?)**: Lists available resource templates.

**listPrompts(options?)**: Lists available prompts with optional pagination.

**getPrompt({ name, arguments?, options? })**: Retrieves a prompt by name with optional arguments.

**onElicitationRequest(schema, handler)**: Registers handler for server elicitation requests during tool execution. Handler receives request with message and requestedSchema, returns object with action ("accept", "decline", "cancel") and optional content.

**close()**: Closes connection and cleans up resources.

## Example
```typescript
import { experimental_createMCPClient as createMCPClient, generateText } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { openai } from '@ai-sdk/openai';

let client;
try {
  client = await createMCPClient({
    transport: new Experimental_StdioMCPTransport({
      command: 'node server.js',
    }),
  });
  const tools = await client.tools();
  const response = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    tools,
    messages: [{ role: 'user', content: 'Query the data' }],
  });
  console.log(response);
} catch (error) {
  console.error('Error:', error);
} finally {
  if (client) await client.close();
}
```

## Error Handling
Throws `MCPClientError` for initialization failures, protocol mismatches, missing capabilities, and connection failures. Tool execution errors propagate as `CallToolError`. Unknown errors trigger `onUncaughtError` callback.

## Limitations
Does not support server notifications or custom client configuration. Feature is experimental.