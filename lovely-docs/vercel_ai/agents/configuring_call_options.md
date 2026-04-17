## Call Options Overview

Call options allow passing type-safe structured inputs to agents to dynamically modify behavior at runtime without creating multiple agent instances.

## Why Use Call Options

- Add dynamic context (documents, preferences, session data) to prompts
- Select models dynamically based on request complexity
- Configure tools per request (e.g., pass user location to search tools)
- Customize provider options (reasoning effort, temperature, etc.)

## Implementation Pattern

Define call options in three steps:

1. Define schema with `callOptionsSchema` using Zod
2. Configure with `prepareCall` function to modify agent settings
3. Pass options at runtime to `generate()` or `stream()`

## Examples

**Basic user context injection:**
```ts
const supportAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({
    userId: z.string(),
    accountType: z.enum(['free', 'pro', 'enterprise']),
  }),
  instructions: 'You are a helpful customer support agent.',
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + `\nUser context:
- Account type: ${options.accountType}
- User ID: ${options.userId}`,
  }),
});

await supportAgent.generate({
  prompt: 'How do I upgrade my account?',
  options: { userId: 'user_123', accountType: 'free' },
});
```

**Dynamic model selection:**
```ts
const agent = new ToolLoopAgent({
  model: 'openai/gpt-4o-mini',
  callOptionsSchema: z.object({ complexity: z.enum(['simple', 'complex']) }),
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    model: options.complexity === 'simple' ? 'openai/gpt-4o-mini' : 'openai/o1-mini',
  }),
});

await agent.generate({ prompt: 'What is 2+2?', options: { complexity: 'simple' } });
await agent.generate({ prompt: 'Explain quantum entanglement', options: { complexity: 'complex' } });
```

**Dynamic tool configuration:**
```ts
const newsAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({
    userCity: z.string().optional(),
    userRegion: z.string().optional(),
  }),
  tools: { web_search: openai.tools.webSearch() },
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    tools: {
      web_search: openai.tools.webSearch({
        searchContextSize: 'low',
        userLocation: {
          type: 'approximate',
          city: options.userCity,
          region: options.userRegion,
          country: 'US',
        },
      }),
    },
  }),
});

await newsAgent.generate({
  prompt: 'What are the top local news stories?',
  options: { userCity: 'San Francisco', userRegion: 'California' },
});
```

**Provider-specific options:**
```ts
const agent = new ToolLoopAgent({
  model: 'openai/o1-mini',
  callOptionsSchema: z.object({ taskDifficulty: z.enum(['low', 'medium', 'high']) }),
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    providerOptions: {
      openai: { reasoningEffort: options.taskDifficulty },
    },
  }),
});

await agent.generate({ prompt: 'Analyze this complex scenario...', options: { taskDifficulty: 'high' } });
```

**Retrieval Augmented Generation (RAG):**
```ts
const ragAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({ query: z.string() }),
  prepareCall: async ({ options, ...settings }) => {
    const documents = await vectorSearch(options.query);
    return {
      ...settings,
      instructions: `Answer questions using the following context:\n\n${documents.map(doc => doc.content).join('\n\n')}`,
    };
  },
});

await ragAgent.generate({
  prompt: 'What is our refund policy?',
  options: { query: 'refund policy' },
});
```

Note: `prepareCall` can be async, enabling data fetching before agent configuration.

**Combining multiple modifications:**
```ts
const agent = new ToolLoopAgent({
  model: 'openai/gpt-5-nano',
  callOptionsSchema: z.object({
    userRole: z.enum(['admin', 'user']),
    urgency: z.enum(['low', 'high']),
  }),
  tools: { readDatabase: readDatabaseTool, writeDatabase: writeDatabaseTool },
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    model: options.urgency === 'high' ? 'anthropic/claude-sonnet-4.5' : settings.model,
    activeTools: options.userRole === 'admin' ? ['readDatabase', 'writeDatabase'] : ['readDatabase'],
    instructions: `You are a ${options.userRole} assistant.\n${options.userRole === 'admin' ? 'You have full database access.' : 'You have read-only access.'}`,
  }),
});

await agent.generate({
  prompt: 'Update the user record',
  options: { userRole: 'admin', urgency: 'high' },
});
```

**Using with createAgentUIStreamResponse:**
```ts
export async function POST(request: Request) {
  const { messages, userId, accountType } = await request.json();
  return createAgentUIStreamResponse({
    agent: myAgent,
    messages,
    options: { userId, accountType },
  });
}
```