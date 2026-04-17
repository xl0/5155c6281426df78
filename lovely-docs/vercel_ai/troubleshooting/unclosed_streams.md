## Problem
Streamable UI created with `createStreamableUI` can be slow to update if the stream is not properly closed.

## Solution
Call the `.done()` method on the stream to close it. This ensures the stream is properly finalized and updates are flushed.

## Example
```tsx
import { createStreamableUI } from '@ai-sdk/rsc';

const submitMessage = async () => {
  'use server';
  const stream = createStreamableUI('1');
  stream.update('2');
  stream.append('3');
  stream.done('4'); // Close the stream
  return stream.value;
};
```