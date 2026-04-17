## AI_NoSuchModelError

Thrown when a model ID cannot be found.

### Properties
- `modelId`: The ID of the model that was not found
- `modelType`: The type of model
- `message`: The error message

### Detection
```typescript
import { NoSuchModelError } from 'ai';

if (NoSuchModelError.isInstance(error)) {
  // Handle the error
}
```