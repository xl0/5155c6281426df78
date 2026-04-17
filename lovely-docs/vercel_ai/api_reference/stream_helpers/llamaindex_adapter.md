## LlamaIndex Adapter

Transforms LlamaIndex output streams into data streams and data stream responses for use with the Vercel AI SDK.

### Supported Streams
- LlamaIndex ChatEngine streams
- LlamaIndex QueryEngine streams

### API Methods

**toDataStream**
- Converts LlamaIndex output streams to data stream
- Signature: `(stream: AsyncIterable<EngineResponse>, AIStreamCallbacksAndOptions) => AIStream`

**toDataStreamResponse**
- Converts LlamaIndex output streams to data stream response
- Signature: `(stream: AsyncIterable<EngineResponse>, options?: {init?: ResponseInit, data?: StreamData, callbacks?: AIStreamCallbacksAndOptions}) => Response`

**mergeIntoDataStream**
- Merges LlamaIndex output streams into an existing data stream
- Signature: `(stream: AsyncIterable<EngineResponse>, options: { dataStream: DataStreamWriter; callbacks?: StreamCallbacks }) => void`

### Example: Convert LlamaIndex ChatEngine Stream

```tsx
import { OpenAI, SimpleChatEngine } from 'llamaindex';
import { toDataStreamResponse } from '@ai-sdk/llamaindex';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const llm = new OpenAI({ model: 'gpt-4o' });
  const chatEngine = new SimpleChatEngine({ llm });
  const stream = await chatEngine.chat({
    message: prompt,
    stream: true,
  });
  return toDataStreamResponse(stream);
}
```