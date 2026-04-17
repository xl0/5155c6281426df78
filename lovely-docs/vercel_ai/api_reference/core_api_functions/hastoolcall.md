## hasToolCall()

Creates a stop condition that halts tool-calling loops when a specific tool is invoked.

Used with the `stopWhen` parameter in `generateText()` and `streamText()` to control agent behavior.

### Parameters
- `toolName` (string): Name of the tool that triggers the stop condition

### Returns
A `StopCondition` function that returns `true` when the specified tool is called in the current step.

### Examples

Basic usage - stop when a tool is called:
```ts
import { generateText, hasToolCall } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: {
    submitAnswer: submitAnswerTool,
    search: searchTool,
  },
  stopWhen: hasToolCall('submitAnswer'),
});
```

Combining multiple stop conditions:
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    weather: weatherTool,
    search: searchTool,
    finalAnswer: finalAnswerTool,
  },
  stopWhen: [
    hasToolCall('weather'),
    hasToolCall('finalAnswer'),
    stepCountIs(5),
  ],
});
```

Agent pattern - run until final answer:
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    search: searchTool,
    calculate: calculateTool,
    finalAnswer: {
      description: 'Provide the final answer to the user',
      parameters: z.object({ answer: z.string() }),
      execute: async ({ answer }) => answer,
    },
  },
  stopWhen: hasToolCall('finalAnswer'),
});
```