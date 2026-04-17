## Problem
Streaming doesn't work in local development or proxied deployments. Instead of streaming responses, the full response is returned after a delay.

## Root Cause
Proxy middleware configured to compress responses breaks streaming.

## Solution
Add `'Content-Encoding': 'none'` header to disable compression on streaming responses:

```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Content-Encoding': 'none',
  },
});
```