## Problem
When using `useChat`, generic "An error occurred" error messages appear instead of detailed error information.

## Root Cause
Error messages from `streamText` are masked by default when using `toDataStreamResponse` for security reasons to prevent leaking sensitive information to the client.

## Solution
Use the `getErrorMessage` function to forward error details to the client or log errors.

### Error Handler Implementation
```tsx
export function errorHandler(error: unknown) {
  if (error == null) {
    return 'unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
```

### With streamText and toUIMessageStreamResponse
```tsx
const result = streamText({
  // ...
});

return result.toUIMessageStreamResponse({
  getErrorMessage: errorHandler,
});
```

### With createDataStreamResponse
```tsx
const response = createDataStreamResponse({
  // ...
  async execute(dataStream) {
    // ...
  },
  onError: errorHandler,
});
```