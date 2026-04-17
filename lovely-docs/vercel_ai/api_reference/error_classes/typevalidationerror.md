## AI_TypeValidationError

Thrown when type validation fails during SDK operations.

### Properties
- `value`: The value that failed validation
- `message`: Error message with validation details

### Detection
```typescript
import { TypeValidationError } from 'ai';

if (TypeValidationError.isInstance(error)) {
  // Handle the error
}
```