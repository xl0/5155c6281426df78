## NoObjectGeneratedError with OpenAI Structured Outputs

When using `generateObject` or `streamObject` with OpenAI's structured output generation, you may encounter a `NoObjectGeneratedError` with finish reason `content-filter`. This occurs when your Zod schema contains incompatible types.

### Problematic Code
```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullish(), // ❌ not supported
    email: z.string().optional(), // ❌ not supported
    age: z.number().nullable(), // ✅ supported
  }),
  prompt: 'Generate a user profile',
});
// Error: NoObjectGeneratedError: No object generated.
// Finish reason: content-filter
```

### Root Cause
OpenAI's structured output uses JSON Schema with specific compatibility requirements. The Zod methods `.nullish()` and `.optional()` generate JSON Schema patterns incompatible with OpenAI's implementation, causing the model to reject the schema.

### Solution
Replace `.nullish()` and `.optional()` with `.nullable()`:

```typescript
const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullable(), // ✅ instead of .nullish()
    email: z.string().nullable(), // ✅ instead of .optional()
    age: z.number().nullable(),
  }),
  prompt: 'Generate a user profile',
});

console.log(result.object);
// { name: "John Doe", email: "john@example.com", age: 30 }
// or { name: null, email: null, age: 25 }
```

### Schema Type Compatibility

| Zod Type      | Compatible | Behavior                                   |
| ------------- | ---------- | ------------------------------------------ |
| `.nullable()` | ✅ Yes     | Allows `null` or the specified type        |
| `.optional()` | ❌ No      | Field can be omitted (not supported)       |
| `.nullish()`  | ❌ No      | Allows `null`, `undefined`, or omitted     |