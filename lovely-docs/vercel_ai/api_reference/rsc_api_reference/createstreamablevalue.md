## createStreamableValue

Creates a server-to-client stream for sending serializable data values.

**Import:**
```
import { createStreamableValue } from "@ai-sdk/rsc"
```

**Parameters:**
- `value` (any): Any serializable data supported by RSC (e.g., JSON)

**Returns:**
- A streamable object that can be returned from Server Actions to the client. It holds the initial data and can be updated via an update method.

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production; see migration guide for RSC to UI migration.