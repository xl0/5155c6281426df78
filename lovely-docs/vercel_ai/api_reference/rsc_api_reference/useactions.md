## useActions Hook

A client-side hook for accessing Server Actions from the AI SDK RSC. Required for proper integration because Server Actions are patched when passed through context; accessing them directly causes "Cannot find Client Component" errors.

**Import:**
```javascript
import { useActions } from "@ai-sdk/rsc"
```

**Returns:** `Record<string, Action>` - a dictionary of server actions.

**Use Cases:**
- Building interfaces requiring user interactions with the server
- Managing AI and UI states in Next.js applications
- Routing React components using a language model

**Note:** AI SDK RSC is experimental; AI SDK UI is recommended for production. Migration guide available.