**Issue**: After upgrading to AI SDK v3.0.20 or newer, client-side function calls are no longer invoked when using `OpenAIStream`.

**Solution**: Add a stub for `experimental_onFunctionCall` to `OpenAIStream` to enable correct forwarding of function calls to the client:

```tsx
const stream = OpenAIStream(response, {
  async experimental_onFunctionCall() {
    return;
  },
});
```