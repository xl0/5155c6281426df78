## stepCountIs()

Creates a stop condition that halts a tool-calling loop when the number of steps reaches a specified count.

Used with the `stopWhen` parameter in `generateText()` and `streamText()`.

### API

**Parameters:**
- `count` (number): Maximum number of steps to execute before stopping

**Returns:** A `StopCondition` function that returns `true` when step count is reached

### Examples

Stop after 3 steps:
```ts
import { generateText, stepCountIs } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: stepCountIs(3),
});
```

Combine multiple stop conditions:
```ts
import { generateText, stepCountIs, hasToolCall } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: [stepCountIs(10), hasToolCall('finalAnswer')],
});
```

Related: `hasToolCall()`, `generateText()`, `streamText()`