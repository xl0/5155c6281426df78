## AI_APICallError

Error thrown when an API call fails.

### Properties
- `url`: URL of the failed API request
- `requestBodyValues`: Request body values sent to the API
- `statusCode`: HTTP status code returned
- `responseHeaders`: Response headers returned
- `responseBody`: Response body returned
- `isRetryable`: Boolean indicating if request can be retried based on status code
- `data`: Additional data associated with the error

### Checking for this Error

```typescript
import { APICallError } from 'ai';

if (APICallError.isInstance(error)) {
  // Handle the error
}
```