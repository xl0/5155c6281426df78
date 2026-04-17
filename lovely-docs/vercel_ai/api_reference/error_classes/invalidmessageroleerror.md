## AI_InvalidMessageRoleError

Thrown when an invalid message role is provided to the AI SDK.

### Properties
- `role`: The invalid role value that was provided
- `message`: The error message describing the issue

### Detection
Check if an error is an instance of this error type:

```typescript
import { InvalidMessageRoleError } from 'ai';

if (InvalidMessageRoleError.isInstance(error)) {
  // Handle the error
}
```