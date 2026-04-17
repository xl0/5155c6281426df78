## Authentication in RSC

Server Actions are exposed as public, unprotected endpoints. Treat them like public-facing API endpoints and validate user authorization before returning data.

**Example: Protected Server Action**

```tsx
'use server';

import { cookies } from 'next/headers';
import { createStreamableUI } from '@ai-sdk/rsc';
import { validateToken } from '../utils/auth';

export const getWeather = async () => {
  const token = cookies().get('token');

  if (!token || !validateToken(token)) {
    return { error: 'This action requires authentication' };
  }

  const streamableDisplay = createStreamableUI(null);
  streamableDisplay.update(<Skeleton />);
  streamableDisplay.done(<Weather />);

  return { display: streamableDisplay.value };
};
```

Extract authentication tokens from cookies, validate them before processing, and return error responses for unauthorized requests.