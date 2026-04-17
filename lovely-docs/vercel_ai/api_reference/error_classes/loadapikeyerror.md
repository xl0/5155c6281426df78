Error thrown when API key fails to load successfully.

**Properties:**
- `message`: The error message

**Detection:**
```typescript
import { LoadAPIKeyError } from 'ai';

if (LoadAPIKeyError.isInstance(error)) {
  // Handle the error
}
```