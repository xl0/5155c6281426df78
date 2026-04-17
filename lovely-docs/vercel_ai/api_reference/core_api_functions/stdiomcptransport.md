## Experimental_StdioMCPTransport

Creates a transport for Model Context Protocol (MCP) clients to communicate with MCP servers using standard input and output streams. Node.js only.

### Import
```javascript
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio"
```

### Configuration (StdioConfig)
- `command` (string, required): The command to run the MCP server
- `args` (string[], optional): Arguments to pass to the MCP server
- `env` (Record<string, string>, optional): Environment variables for the MCP server
- `stderr` (IOType | Stream | number, optional): Stream to write the MCP server's stderr to
- `cwd` (string, optional): Current working directory for the MCP server

**Note:** This feature is experimental and may change or be removed in the future.