## Overview
AI SDK 6 is a major version introducing the v3 Language Model Specification with new capabilities like agents and tool approval. Unlike AI SDK 5, it's not expected to have major breaking changes for most users.

## Installation
```bash
npm install ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta
```

## Agent Abstraction

New unified `Agent` interface for building agents with full control over execution flow, tool loops, and state management.

### ToolLoopAgent (Default Implementation)
```typescript
import { openai } from '@ai-sdk/openai';
import { ToolLoopAgent } from 'ai';
import { weatherTool } from '@/tool/weather';

const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful weather assistant.',
  tools: { weather: weatherTool },
});

const result = await weatherAgent.generate({
  prompt: 'What is the weather in San Francisco?',
});
```

Automatically handles: calls LLM → executes tool calls → adds results back → repeats until complete (default `stopWhen: stepCountIs(20)`).

### Call Options
Type-safe runtime configuration for dynamic agent behavior:
```typescript
const supportAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({
    userId: z.string(),
    accountType: z.enum(['free', 'pro', 'enterprise']),
  }),
  instructions: 'You are a helpful customer support agent.',
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + `\nUser context:\n- Account type: ${options.accountType}\n- User ID: ${options.userId}`,
  }),
});

const result = await supportAgent.generate({
  prompt: 'How do I upgrade my account?',
  options: { userId: 'user_123', accountType: 'free' },
});
```

Use cases: RAG (inject documents), dynamic model selection, tool configuration, provider options.

### UI Integration
```typescript
// Server
import { createAgentUIStreamResponse } from 'ai';
export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({ agent: weatherAgent, messages });
}

// Client
import { useChat } from '@ai-sdk/react';
import { InferAgentUIMessage } from 'ai';
type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;
const { messages, sendMessage } = useChat<WeatherAgentUIMessage>();
```

### Custom Agent Implementations
`Agent` is an interface, not a concrete class. Implement it for custom architectures:
```typescript
class Orchestrator implements Agent {
  constructor(private subAgents: Record<string, Agent>) {}
}
```

## Tool Execution Approval

Control when tools are executed with `needsApproval`:
```typescript
const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({ city: z.string() }),
  needsApproval: true,
  execute: async ({ city }) => fetchWeather(city),
});
```

### Dynamic Approval
```typescript
const paymentTool = tool({
  description: 'Process a payment',
  inputSchema: z.object({ amount: z.number(), recipient: z.string() }),
  needsApproval: async ({ amount }) => amount > 1000,
  execute: async ({ amount, recipient }) => processPayment(amount, recipient),
});
```

### Client-Side Approval UI
```tsx
export function WeatherToolView({ invocation, addToolApprovalResponse }) {
  if (invocation.state === 'approval-requested') {
    return (
      <div>
        <p>Can I retrieve the weather for {invocation.input.city}?</p>
        <button onClick={() => addToolApprovalResponse({ id: invocation.approval.id, approved: true })}>Approve</button>
        <button onClick={() => addToolApprovalResponse({ id: invocation.approval.id, approved: false })}>Deny</button>
      </div>
    );
  }
  if (invocation.state === 'output-available') {
    return <div>Weather: {invocation.output.weather}, Temperature: {invocation.output.temperature}°F</div>;
  }
}
```

### Auto-Submit After Approvals
```typescript
const { messages, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});
```

## Structured Output (Stable)

Generate structured data alongside multi-step tool calling using the `output` parameter:
```typescript
import { Output, ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temperature: 72, condition: 'sunny' }),
    }),
  },
  output: Output.object({
    schema: z.object({
      summary: z.string(),
      temperature: z.number(),
      recommendation: z.string(),
    }),
  }),
});

const { output } = await agent.generate({
  prompt: 'What is the weather in San Francisco and what should I wear?',
});
// { summary: "It's sunny in San Francisco", temperature: 72, recommendation: "Wear light clothing and sunglasses" }
```

### Output Types
- `Output.object()`: Zod schemas
- `Output.array()`: Arrays of structured objects
- `Output.choice()`: Select from specific options
- `Output.text()`: Plain text (default)

### Streaming Structured Output
```typescript
const profileAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'Generate realistic person profiles.',
  output: Output.object({
    schema: z.object({ name: z.string(), age: z.number(), occupation: z.string() }),
  }),
});

const { partialOutputStream } = await profileAgent.stream({
  prompt: 'Generate a person profile.',
});

for await (const partial of partialOutputStream) {
  console.log(partial);
  // { name: "John" }
  // { name: "John", age: 30 }
  // { name: "John", age: 30, occupation: "Engineer" }
}
```

Structured outputs also supported in `generateText` and `streamText`. When using these, configure multiple steps with `stopWhen` (e.g., `stopWhen: stepCountIs(2)` for tool calling + output generation).

## Reranking Support

Improve search relevance by reordering documents based on query relationship using specialized reranking models:
```typescript
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const documents = ['sunny day at the beach', 'rainy afternoon in the city', 'snowy night in the mountains'];
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'talk about rain',
  topN: 2,
});
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }
// ]
```

### Structured Document Reranking
```typescript
const documents = [
  { from: 'Paul Doe', subject: 'Follow-up', text: 'We are happy to give you a discount of 20%...' },
  { from: 'John McGill', subject: 'Missing Info', text: 'Sorry, but here is the pricing information from Oracle: $5000/month' },
];

const { rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});
// { from: 'John McGill', subject: 'Missing Info', text: '...' }
```

Supported providers: Cohere, Amazon Bedrock, Together.ai.

## Image Editing Support
Coming soon: image-to-image transformations and multi-modal editing with text prompts.

## Migration from AI SDK 5.x
Minimal breaking changes expected. Version bump is due to v3 Language Model Specification, but most AI SDK 5 code will work with little or no modification.

## Timeline
- AI SDK 6 Beta: Available now
- Stable Release: End of 2025