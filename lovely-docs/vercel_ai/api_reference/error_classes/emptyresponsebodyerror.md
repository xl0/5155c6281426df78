## AI_EmptyResponseBodyError

Thrown when the server returns an empty response body.

### Properties
- `message`: The error message

### Detection
```typescript
import { EmptyResponseBodyError } from 'ai';

if (EmptyResponseBodyError.isInstance(error)) {
  // Handle the error
}
```