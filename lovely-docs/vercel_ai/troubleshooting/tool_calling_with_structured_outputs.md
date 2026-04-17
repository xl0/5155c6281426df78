## Problem
`generateObject` and `streamObject` don't support tool calling. To combine tool calling with structured outputs, you must use `generateText` or `streamText` with the `output` option instead.

## Key Detail
When using `output` with tool calling, structured output generation counts as an additional execution step. This affects the `stopWhen` condition.

## Solution
Adjust `stopWhen` to account for the extra step:

```tsx
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  output: Output.object({
    schema: z.object({
      summary: z.string(),
      sentiment: z.enum(['positive', 'neutral', 'negative']),
    }),
  }),
  tools: {
    analyze: tool({
      description: 'Analyze data',
      inputSchema: z.object({
        data: z.string(),
      }),
      execute: async ({ data }) => {
        return { result: 'analyzed' };
      }),
    },
  },
  stopWhen: stepCountIs(3), // tool call + tool result + structured output
  prompt: 'Analyze the data and provide a summary',
});
```

The `stopWhen: stepCountIs(3)` accounts for: tool call execution, tool result processing, and structured output generation. Increment your intended step count by at least 1 to accommodate the structured output step.