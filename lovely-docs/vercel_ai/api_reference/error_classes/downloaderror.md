## AI_DownloadError

Error thrown when a download fails.

### Properties
- `url`: The URL that failed to download
- `statusCode`: HTTP status code from the server
- `statusText`: HTTP status text from the server
- `message`: Error message with download failure details

### Checking for this Error

```typescript
import { DownloadError } from 'ai';

if (DownloadError.isInstance(error)) {
  // Handle the error
}
```