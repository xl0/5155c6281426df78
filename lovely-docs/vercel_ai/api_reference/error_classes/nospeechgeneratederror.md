## NoSpeechGeneratedError

Thrown when audio generation fails to produce any output from the provided input.

### Properties
- `responses`: Array of responses
- `message`: Error message string

### Detection
```typescript
import { NoSpeechGeneratedError } from 'ai';

if (NoSpeechGeneratedError.isInstance(error)) {
  // Handle error
}
```