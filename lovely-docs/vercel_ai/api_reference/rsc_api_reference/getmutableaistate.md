## getMutableAIState

Get a mutable copy of the AI state for server-side updates.

**Import:**
```
import { getMutableAIState } from "@ai-sdk/rsc"
```

**Parameters:**
- `key` (optional, string): Returns the value of the specified key in the AI state if it's an object.

**Returns:** Mutable AI state object with methods:
- `update(newState: any)`: Updates the AI state with new state
- `done(newState: any)`: Updates the AI state, marks it as finalized, and closes the stream

**Example:** Persist and restore AI and UI states in Next.js (see state-management/save-and-restore-states example)

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production; migration guide available.