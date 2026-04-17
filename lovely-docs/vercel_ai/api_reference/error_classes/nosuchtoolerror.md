Error thrown when a model attempts to call a tool that is not available in the current context.

**Properties:**
- `toolName`: Name of the tool that was not found
- `availableTools`: Array of available tool names
- `message`: Error message

**Detection:**
```typescript
import { NoSuchToolError } from 'ai';

if (NoSuchToolError.isInstance(error)) {
  // Handle the error
}
```