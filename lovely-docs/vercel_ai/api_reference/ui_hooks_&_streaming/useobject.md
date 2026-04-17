## useObject Hook

Experimental React/Svelte/Vue hook for consuming text streams representing JSON objects and parsing them into typed objects based on a schema.

### Purpose
Consumes streamed JSON chunks from a backend endpoint and progressively builds a complete object matching a provided schema. Pairs with `streamObject` on the backend.

### Parameters
- **api** (string): Endpoint URL (relative or absolute) that streams JSON matching the schema as chunked text
- **schema** (Zod Schema | JSON Schema): Defines the object shape; use Zod schema or `jsonSchema()` function
- **id?** (string): Unique identifier for shared state across components; auto-generated if omitted
- **initialValue?** (DeepPartial<RESULT>): Initial object value
- **fetch?** (FetchFunction): Custom fetch implementation; defaults to global fetch
- **headers?** (Record<string, string> | Headers): Request headers
- **credentials?** (RequestCredentials): Fetch credentials mode ("omit", "same-origin", "include")
- **onError?** ((error: Error) => void): Error callback
- **onFinish?** ((result: OnFinishResult) => void): Called when streaming completes; receives `object` (typed result or undefined if invalid) and `error` (TypeValidationError if schema mismatch)

### Returns
- **submit** ((input: INPUT) => void): Calls API with input as JSON body
- **object** (DeepPartial<RESULT> | undefined): Current generated object, updated as JSON chunks arrive
- **error** (Error | unknown): API call error if present
- **isLoading** (boolean): Whether request is in progress
- **stop** (() => void): Aborts current request
- **clear** (() => void): Clears object state

### Example
```tsx
'use client';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';

export default function Page() {
  const { object, submit, isLoading } = useObject({
    api: '/api/use-object',
    schema: z.object({ content: z.string() }),
  });

  return (
    <div>
      <button onClick={() => submit('example input')} disabled={isLoading}>
        Generate
      </button>
      {object?.content && <p>{object.content}</p>}
    </div>
  );
}
```