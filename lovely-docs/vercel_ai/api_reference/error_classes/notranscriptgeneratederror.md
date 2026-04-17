Error thrown when no transcript could be generated from the input.

**Properties:**
- `responses`: Array of responses
- `message`: The error message

**Checking for the error:**
```typescript
import { NoTranscriptGeneratedError } from 'ai';

if (NoTranscriptGeneratedError.isInstance(error)) {
  // Handle the error
}
```