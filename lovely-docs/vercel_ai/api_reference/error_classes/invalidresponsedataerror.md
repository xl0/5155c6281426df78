Error thrown when the server returns a response with invalid data content.

**Properties:**
- `data`: The invalid response data value
- `message`: The error message

**Type checking:**
```typescript
import { InvalidResponseDataError } from 'ai';

if (InvalidResponseDataError.isInstance(error)) {
  // Handle the error
}
```