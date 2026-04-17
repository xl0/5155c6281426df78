Error thrown when message conversion fails during processing.

**Properties:**
- `originalMessage`: The original message that failed conversion
- `message`: The error message

**Detection:**
```typescript
import { MessageConversionError } from 'ai';

if (MessageConversionError.isInstance(error)) {
  // Handle the error
}
```