## ToolLoopAgent Class

The ToolLoopAgent class encapsulates LLM configuration, tools, and behavior into reusable components. It handles the agent loop automatically, allowing the LLM to call tools multiple times in sequence.

Benefits:
- Reuse configurations across your application
- Maintain consistent behavior and capabilities
- Reduce boilerplate in API routes
- Full TypeScript support

## Creating an Agent

```ts
import { ToolLoopAgent } from 'ai';

const myAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { /* your tools */ },
});
```

## Configuration Options

**Model and System Instructions:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are an expert software engineer.',
});
```

**Tools:**
```ts
import { tool } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    runCode: tool({
      description: 'Execute Python code',
      inputSchema: z.object({ code: z.string() }),
      execute: async ({ code }) => ({ output: 'Code executed successfully' }),
    }),
  },
});
```

**Loop Control:**
By default, agents run for 20 steps. Each step is one generation (text or tool call). The loop continues until a finish reason other than tool-calls is returned, a tool without execute function is called, a tool needs approval, or a stop condition is met.

```ts
import { stepCountIs } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  stopWhen: stepCountIs(20), // Allow up to 20 steps
  // or combine conditions:
  stopWhen: [stepCountIs(20), yourCustomCondition()],
});
```

**Tool Choice:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: weatherTool, cityAttractions: attractionsTool },
  toolChoice: 'required', // 'auto' (default), 'none', or specific tool
  // or force specific tool:
  toolChoice: { type: 'tool', toolName: 'weather' },
});
```

**Structured Output:**
```ts
import { Output } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  output: Output.object({
    schema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      summary: z.string(),
      keyPoints: z.array(z.string()),
    }),
  }),
  stopWhen: stepCountIs(10),
});

const { output } = await agent.generate({
  prompt: 'Analyze customer feedback from the last quarter',
});
```

## System Instructions

System instructions define agent behavior, personality, and constraints. Examples:

**Basic role:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are an expert data analyst. You provide clear insights from complex data.',
});
```

**Detailed behavioral guidelines:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a senior software engineer conducting code reviews.
  Your approach:
  - Focus on security vulnerabilities first
  - Identify performance bottlenecks
  - Suggest improvements for readability and maintainability
  - Be constructive and educational in your feedback
  - Always explain why something is an issue and how to fix it`,
});
```

**Constrained behavior:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a customer support specialist for an e-commerce platform.
  Rules:
  - Never make promises about refunds without checking the policy
  - Always be empathetic and professional
  - If you don't know something, say so and offer to escalate
  - Keep responses concise and actionable
  - Never share internal company information`,
  tools: { checkOrderStatus, lookupPolicy, createTicket },
});
```

**Tool usage guidance:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a research assistant with access to search and document tools.
  When researching:
  1. Always start with a broad search to understand the topic
  2. Use document analysis for detailed information
  3. Cross-reference multiple sources before drawing conclusions
  4. Cite your sources when presenting information
  5. If information conflicts, present both viewpoints`,
  tools: { webSearch, analyzeDocument, extractQuotes },
});
```

**Format and style:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a technical documentation writer.
  Writing style:
  - Use clear, simple language
  - Avoid jargon unless necessary
  - Structure information with headers and bullet points
  - Include code examples where relevant
  - Write in second person ("you" instead of "the user")
  Always format responses in Markdown.`,
});
```

## Using an Agent

**Generate text (one-time):**
```ts
const result = await myAgent.generate({ prompt: 'What is the weather like?' });
console.log(result.text);
```

**Stream text:**
```ts
const stream = myAgent.stream({ prompt: 'Tell me a story' });
for await (const chunk of stream.textStream) {
  console.log(chunk);
}
```

**API response for UI:**
```ts
import { createAgentUIStreamResponse } from 'ai';

export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({ agent: myAgent, messages });
}
```

## Type Safety

Infer types for agent UIMessages:
```ts
import { InferAgentUIMessage } from 'ai';

const myAgent = new ToolLoopAgent({ /* ... */ });
export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

Use in client components:
```tsx
import { useChat } from '@ai-sdk/react';
import type { MyAgentUIMessage } from '@/agent/my-agent';

export function Chat() {
  const { messages } = useChat<MyAgentUIMessage>();
  // Full type safety for messages and tools
}
```