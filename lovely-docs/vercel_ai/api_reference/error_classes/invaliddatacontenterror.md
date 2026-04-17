Error thrown when multi-modal message data content is invalid.

**Properties:**
- `content`: The invalid content value
- `message`: Error message describing expected vs received content types

**Detection:**
```typescript
import { InvalidDataContentError } from 'ai';

if (InvalidDataContentError.isInstance(error)) {
  // Handle the error
}
```

Occurs when providing invalid data content in multi-modal message parts. Refer to prompt examples for multi-modal messages for valid content formats.