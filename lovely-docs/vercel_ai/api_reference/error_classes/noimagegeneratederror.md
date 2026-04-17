## AI_NoImageGeneratedError

Thrown when an image generation provider fails to generate an image, either because the model failed to generate a response or generated an invalid response.

### Properties
- `message`: Error message
- `responses`: Metadata about image model responses (timestamp, model, headers)
- `cause`: Root cause for detailed error handling

### Usage
```typescript
import { generateImage, NoImageGeneratedError } from 'ai';

try {
  await generateImage({ model, prompt });
} catch (error) {
  if (NoImageGeneratedError.isInstance(error)) {
    console.log('NoImageGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

Check error type with `NoImageGeneratedError.isInstance(error)` to access error-specific properties.