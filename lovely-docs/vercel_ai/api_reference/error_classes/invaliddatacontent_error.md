## AI_InvalidDataContent Error

Thrown when invalid data content is provided to the SDK.

### Properties
- `content`: The invalid content value
- `message`: The error message
- `cause`: The cause of the error

### Detection
```typescript
import { InvalidDataContent } from 'ai';

if (InvalidDataContent.isInstance(error)) {
  // Handle the error
}
```