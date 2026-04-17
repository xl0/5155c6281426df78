## AI_InvalidToolInputError

Thrown when a tool receives invalid input.

### Properties
- `toolName`: Name of the tool with invalid inputs
- `toolInput`: The invalid tool inputs
- `message`: Error message
- `cause`: Cause of the error

### Detection
```typescript
import { InvalidToolInputError } from 'ai';

if (InvalidToolInputError.isInstance(error)) {
  // Handle the error
}
```