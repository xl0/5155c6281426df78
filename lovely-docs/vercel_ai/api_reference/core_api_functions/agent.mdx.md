## Agent Interface

The `Agent` interface defines a contract for AI agents that generate or stream responses to prompts. Agents can encapsulate advanced logic like tool usage, multi-step workflows, and prompt handling.

### Interface Definition

```ts
export type AgentCallParameters<CALL_OPTIONS> = ([CALL_OPTIONS] extends [never]
  ? { options?: never }
  : { options: CALL_OPTIONS }) &
  (
    | { prompt: string | Array<ModelMessage>; messages?: never }
    | { messages: Array<ModelMessage>; prompt?: never }
  ) & {
    abortSignal?: AbortSignal;
  };

export interface Agent<
  CALL_OPTIONS = never,
  TOOLS extends ToolSet = {},
  OUTPUT extends Output = never,
> {
  readonly version: 'agent-v1';
  readonly id: string | undefined;
  readonly tools: TOOLS;
  generate(options: AgentCallParameters<CALL_OPTIONS>): PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>;
  stream(options: AgentCallParameters<CALL_OPTIONS>): PromiseLike<StreamTextResult<TOOLS, OUTPUT>>;
}
```

### Core Properties & Methods

- `version`: `'agent-v1'` — Interface version for compatibility
- `id`: `string | undefined` — Optional agent identifier
- `tools`: `ToolSet` — Available tools for the agent
- `generate()`: Returns `PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>` — Non-streaming output
- `stream()`: Returns `PromiseLike<StreamTextResult<TOOLS, OUTPUT>>` — Streaming output

### Generic Parameters

- `CALL_OPTIONS` (default: `never`): Type for additional call options
- `TOOLS` (default: `{}`): Type of the tool set
- `OUTPUT` (default: `never`): Type of additional output data

### Method Parameters

Both `generate()` and `stream()` accept `AgentCallParameters<CALL_OPTIONS>`:
- `prompt`: String or array of `ModelMessage` objects
- `messages`: Array of `ModelMessage` objects (mutually exclusive with `prompt`)
- `options`: Additional call options when `CALL_OPTIONS` is not `never`
- `abortSignal`: `AbortSignal` to cancel the operation

### Custom Agent Implementation

```ts
import { Agent } from 'ai';
import type { ModelMessage } from '@ai-sdk/provider-utils';

class MyEchoAgent implements Agent {
  version = 'agent-v1' as const;
  id = 'echo';
  tools = {};

  async generate({ prompt, messages, abortSignal }) {
    const text = prompt ?? JSON.stringify(messages);
    return { text, steps: [] };
  }

  async stream({ prompt, messages, abortSignal }) {
    const text = prompt ?? JSON.stringify(messages);
    return {
      textStream: (async function* () {
        yield text;
      })(),
    };
  }
}
```

### Usage with SDK Utilities

All SDK utilities that accept agents (like `createAgentUIStream`, `createAgentUIStreamResponse`, `pipeAgentUIStreamToResponse`) expect an object adhering to the `Agent` interface. Use the official `ToolLoopAgent` for multi-step workflows with tool use, or supply a custom implementation:

```ts
import { ToolLoopAgent, createAgentUIStream } from "ai";

const agent = new ToolLoopAgent({ ... });
const stream = await createAgentUIStream({
  agent,
  messages: [{ role: "user", content: "What is the weather in NYC?" }]
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

### Key Notes

- Agents should define `tools` property even if empty (`{}`)
- Accept either `prompt` or `messages`, not both
- `CALL_OPTIONS` generic allows agents to accept additional call-specific options
- `abortSignal` enables operation cancellation
- Design supports both complex autonomous agents and simple LLM wrappers