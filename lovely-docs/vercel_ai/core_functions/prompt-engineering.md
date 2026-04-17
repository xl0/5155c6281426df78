## Tips for Prompts with Tools

When creating prompts that include tools, follow these best practices:

1. Use strong tool-calling models like `gpt-4` or `gpt-4.1`; weaker models struggle with tool calls
2. Keep tool count low (≤5) and parameter complexity minimal
3. Use semantically meaningful names for tools, parameters, and properties
4. Add `.describe("...")` to Zod schema properties to hint at their purpose
5. Document tool output in the `description` field when outputs are unclear or tools have dependencies
6. Include JSON example input/outputs of tool calls in prompts to teach the model how to use them

## Tool & Structured Data Schemas

Zod-to-LLM schema mapping isn't always straightforward.

**Zod Dates**: Models return dates as strings, not JavaScript Date objects. Use `z.string().datetime()` or `z.string().date()` with a transformer:

```ts
const result = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({
    events: z.array(
      z.object({
        event: z.string(),
        date: z.string().date().transform(value => new Date(value)),
      }),
    ),
  }),
  prompt: 'List 5 important events from the year 2000.',
});
```

**Optional Parameters**: Some providers with strict schema validation (e.g., OpenAI structured outputs) fail with `.optional()`. Use `.nullable()` instead:

```ts
// Fails with strict validation
const failingTool = tool({
  description: 'Execute a command',
  inputSchema: z.object({
    command: z.string(),
    workdir: z.string().optional(),
  }),
});

// Works with strict validation
const workingTool = tool({
  description: 'Execute a command',
  inputSchema: z.object({
    command: z.string(),
    workdir: z.string().nullable(),
  }),
});
```

**Temperature Settings**: Use `temperature: 0` for tool calls and object generation to ensure deterministic results:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  temperature: 0,
  tools: {
    myTool: tool({
      description: 'Execute a command',
      inputSchema: z.object({ command: z.string() }),
    }),
  },
  prompt: 'Execute the ls command',
});
```

Lower temperature reduces randomness, critical for structured data generation, precise tool calls, and strict schema compliance.

## Debugging

**Inspecting Warnings**: Check provider support for features via `result.warnings`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Hello, world!',
});
console.log(result.warnings);
```

**HTTP Request Bodies**: Inspect raw request payloads via `result.request.body`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Hello, world!',
});
console.log(result.request.body);
```