Error thrown when JSON parsing fails.

**Properties:**
- `text`: The text value that could not be parsed
- `message`: Error message including parse error details

**Checking for this error:**
```typescript
import { JSONParseError } from 'ai';

if (JSONParseError.isInstance(error)) {
  // Handle the error
}
```