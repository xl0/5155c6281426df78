## createStreamableUI

Server-side function that creates a stream for sending React UI components from server to client. The client receives and renders the streamed UI as normal React nodes.

**Import:**
```
import { createStreamableUI } from "@ai-sdk/rsc"
```

**Parameters:**
- `initialValue` (ReactNode, optional): Initial UI value

**Returns:**
- `value` (ReactNode): The streamable UI that can be returned from a Server Action and received by the client

**Methods:**
- `update(ReactNode)`: Replace current UI node with a new one
- `append(ReactNode)`: Append a new UI node; previous node becomes immutable after append
- `done(ReactNode | null)`: Finalize and close the stream; required to call, otherwise response stays in loading state
- `error(Error)`: Signal an error in the stream; thrown on client and caught by nearest error boundary

**Example:** Render a React component during a tool call (see examples/next-app/tools/render-interface-during-tool-call)