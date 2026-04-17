## AI_UnsupportedFunctionalityError

Thrown when a feature is not supported by the SDK.

### Properties
- `functionality`: name of the unsupported feature
- `message`: error message

### Detection
```typescript
import { UnsupportedFunctionalityError } from 'ai';

if (UnsupportedFunctionalityError.isInstance(error)) {
  // Handle the error
}
```