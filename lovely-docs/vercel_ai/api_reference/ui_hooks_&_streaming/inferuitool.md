## InferUITool

Type helper that infers input and output types from a tool definition.

**Purpose**: Ensures type safety when working with individual tools in `UIMessage`s.

**Import**:
```tsx
import { InferUITool } from 'ai';
```

**Type Parameters**:
- `TOOL`: The tool to infer types from

**Returns**: A type with shape:
```typescript
{
  input: InferToolInput<TOOL>;
  output: InferToolOutput<TOOL>;
}
```

**Example**:
```tsx
import { InferUITool } from 'ai';
import { z } from 'zod';

const weatherTool = {
  description: 'Get the current weather',
  parameters: z.object({
    location: z.string().describe('The city and state'),
  }),
  execute: async ({ location }) => {
    return `The weather in ${location} is sunny.`;
  },
};

type WeatherUITool = InferUITool<typeof weatherTool>;
// Results in: { input: { location: string }; output: string; }
```

**Related**: `InferUITools` (for tool sets), `ToolUIPart` (tool part type for UI messages)