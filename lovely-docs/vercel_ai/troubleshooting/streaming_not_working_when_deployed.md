When streaming works locally but fails in deployed environments, the full response is returned all at once instead of being streamed. This is caused by deployment environment configuration issues.

To fix streaming in deployed apps, add HTTP headers to the response:

```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Transfer-Encoding': 'chunked',
    Connection: 'keep-alive',
  },
});
```

The `Transfer-Encoding: chunked` header enables chunked transfer encoding, and `Connection: keep-alive` maintains the connection for streaming.