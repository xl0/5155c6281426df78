## ToolCallRepairError

Occurs when the AI fails to repair an invalid tool call. This error is triggered when the AI attempts to fix either a `NoSuchToolError` or `InvalidToolInputError`, but the repair attempt itself fails.

### Properties
- `originalError`: The original error that triggered the repair (either `NoSuchToolError` or `InvalidToolInputError`)
- `message`: The error message
- `cause`: The underlying error that caused the repair to fail

### Detection
```typescript
import { ToolCallRepairError } from 'ai';

if (ToolCallRepairError.isInstance(error)) {
  // Handle the error
}
```