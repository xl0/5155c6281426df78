## Azure OpenAI Slow to Stream

When using OpenAI hosted on Azure, streaming may be slow and arrive in large chunks.

### Cause
This is a Microsoft Azure issue.

### Solutions

1. **Update Content Filtering Settings**: In Azure AI Studio, navigate to "Shared resources" > "Content filters", create a new content filter, and change the "Streaming mode (Preview)" under "Output filter" from "Default" to "Asynchronous Filter".

2. **Use smoothStream transformation**: Apply the `smoothStream` transformation to stream each word individually:

```tsx
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```