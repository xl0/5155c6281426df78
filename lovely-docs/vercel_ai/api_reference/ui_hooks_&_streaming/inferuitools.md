## InferUITools

Type helper that infers input and output types from a `ToolSet` for type-safe tool usage in `UIMessage`s.

### Import
```tsx
import { InferUITools } from 'ai';
```

### API Signature

**Type Parameters:**
- `TOOLS` (ToolSet): The tool set to infer types from.

**Returns:** A mapped type with shape:
```typescript
{
  [NAME in keyof TOOLS & string]: {
    input: InferToolInput<TOOLS[NAME]>;
    output: InferToolOutput<TOOLS[NAME]>;
  };
}
```

### Example

```tsx
import { InferUITools } from 'ai';
import { z } from 'zod';

const tools = {
  weather: {
    description: 'Get the current weather',
    parameters: z.object({
      location: z.string().describe('The city and state'),
    }),
    execute: async ({ location }) => `The weather in ${location} is sunny.`,
  },
  calculator: {
    description: 'Perform basic arithmetic',
    parameters: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    }),
    execute: async ({ operation, a, b }) => {
      const ops = { add: (x, y) => x + y, subtract: (x, y) => x - y, multiply: (x, y) => x * y, divide: (x, y) => x / y };
      return ops[operation](a, b);
    },
  },
};

type MyUITools = InferUITools<typeof tools>;
// Result: {
//   weather: { input: { location: string }; output: string };
//   calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number };
// }
```

### Related
- `InferUITool` - Infer types for a single tool
- `useChat` - Chat hook that supports typed tools