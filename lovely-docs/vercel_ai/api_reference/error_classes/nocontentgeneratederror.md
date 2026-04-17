Error thrown when an AI provider fails to generate content.

**Properties:**
- `message`: The error message

**Detection:**
```typescript
import { NoContentGeneratedError } from 'ai';

if (NoContentGeneratedError.isInstance(error)) {
  // Handle the error
}
```