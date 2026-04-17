## Issue
When using `useChat` or `useCompletion` hooks in React, streaming AI responses cause a "Maximum update depth exceeded" error.

## Root Cause
By default, the UI re-renders on every incoming chunk, which can overload rendering especially on slower devices or with complex components like Markdown.

## Solution
Use the `experimental_throttle` option to throttle UI updates to a specified millisecond interval:

```tsx
// useChat
const { messages, ... } = useChat({
  experimental_throttle: 50
})

// useCompletion
const { completion, ... } = useCompletion({
  experimental_throttle: 50
})
```

Set the throttle value (in milliseconds) to reduce update frequency and prevent the depth exceeded error.