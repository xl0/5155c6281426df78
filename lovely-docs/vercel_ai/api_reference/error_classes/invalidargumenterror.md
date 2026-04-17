Error thrown when an invalid argument is provided to an API function.

**Properties:**
- `parameter`: Name of the invalid parameter
- `value`: The invalid value that was provided
- `message`: Error message describing the issue

**Type checking:**
```typescript
import { InvalidArgumentError } from 'ai';

if (InvalidArgumentError.isInstance(error)) {
  // Handle the error
}
```