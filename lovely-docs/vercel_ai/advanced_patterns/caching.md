## Caching Responses

Two approaches to cache AI provider responses:

### Language Model Middleware (Recommended)

Use `LanguageModelV3Middleware` with `wrapGenerate` and `wrapStream` methods to intercept model calls.

For `wrapGenerate` (used by `generateText`, `generateObject`):
- Create cache key from params: `const cacheKey = JSON.stringify(params)`
- Check cache before calling `doGenerate()`
- Store result in cache after generation

For `wrapStream` (used by `streamText`, `streamObject`):
- Check cache before calling `doStream()`
- If cached, use `simulateReadableStream()` to return cached chunks with configurable delays (`initialDelayInMs`, `chunkDelayInMs`)
- If not cached, pipe stream through `TransformStream` to collect chunks and store in cache on flush

Example using Upstash Redis:
```ts
import { Redis } from '@upstash/redis';
import { LanguageModelV3Middleware, simulateReadableStream } from 'ai';

const redis = new Redis({ url: process.env.KV_URL, token: process.env.KV_TOKEN });

export const cacheMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);
    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return { ...cached, response: { ...cached.response, timestamp: cached?.response?.timestamp ? new Date(cached?.response?.timestamp) : undefined } };
    }
    const result = await doGenerate();
    redis.set(cacheKey, result);
    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    const cacheKey = JSON.stringify(params);
    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      const formattedChunks = (cached as LanguageModelV3StreamPart[]).map(p => 
        p.type === 'response-metadata' && p.timestamp ? { ...p, timestamp: new Date(p.timestamp) } : p
      );
      return { stream: simulateReadableStream({ initialDelayInMs: 0, chunkDelayInMs: 10, chunks: formattedChunks }) };
    }
    const { stream, ...rest } = await doStream();
    const fullResponse: LanguageModelV3StreamPart[] = [];
    const transformStream = new TransformStream({ 
      transform(chunk, controller) { fullResponse.push(chunk); controller.enqueue(chunk); },
      flush() { redis.set(cacheKey, fullResponse); }
    });
    return { stream: stream.pipeThrough(transformStream), ...rest };
  },
};
```

### Lifecycle Callbacks

Use `onFinish` callback in `streamText` to cache response after generation completes.

Example with Upstash Redis and 1-hour expiration:
```ts
import { openai } from '@ai-sdk/openai';
import { formatDataStreamPart, streamText } from 'ai';
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.KV_URL, token: process.env.KV_TOKEN });

export async function POST(req: Request) {
  const { messages } = await req.json();
  const key = JSON.stringify(messages);
  
  const cached = await redis.get(key);
  if (cached != null) {
    return new Response(formatDataStreamPart('text', cached), { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
    async onFinish({ text }) {
      await redis.set(key, text);
      await redis.expire(key, 60 * 60);
    },
  });

  return result.toUIMessageStreamResponse();
}
```

Works with any KV storage provider, not just Upstash Redis.