## getAIState

Retrieves the current AI state in RSC (React Server Components) context.

**Import:**
```
import { getAIState } from "@ai-sdk/rsc"
```

**Parameters:**
- `key` (string, optional): Returns the value of the specified key in the AI state if it's an object.

**Returns:** The AI state.

**Note:** AI SDK RSC is experimental. For production use, AI SDK UI is recommended. Migration guide available.

**Example:** Render a React component during a tool call made by a language model in Next.js (see examples/next-app/tools/render-interface-during-tool-call).