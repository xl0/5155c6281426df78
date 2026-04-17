## Rate Limiting

Rate limiting protects APIs from abuse by setting a maximum threshold on requests per timeframe, preventing excessive usage that degrades performance and increases costs.

### Implementation with Vercel KV and Upstash Ratelimit

Protect API endpoints using Vercel KV (Redis) and Upstash Ratelimit library:

```tsx
import kv from '@vercel/kv';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, '30s'),
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? 'ip';
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Ratelimited!', { status: 429 });
  }

  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
  });

  return result.toUIMessageStreamResponse();
}
```

The pattern: create a Ratelimit instance with Redis backend and fixed window limiter (5 requests per 30 seconds), extract client IP from request, call `ratelimit.limit(ip)` to check if request is allowed, return 429 status if rate limit exceeded, otherwise proceed with normal request handling.