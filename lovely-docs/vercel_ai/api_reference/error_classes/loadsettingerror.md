## AI_LoadSettingError

Error thrown when a setting fails to load successfully.

### Properties
- `message`: The error message

### Detection
Check if an error is an instance of this error type:

```typescript
import { LoadSettingError } from 'ai';

if (LoadSettingError.isInstance(error)) {
  // Handle the error
}
```