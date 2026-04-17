## Purpose
`tool()` is a helper function that enables TypeScript type inference for tool definitions. It connects the `inputSchema` to the `execute` method so that input argument types are automatically inferred.

## Example
```ts
import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});
```

## Parameters

**description** (optional, string): Information about the tool's purpose, how and when it can be used by the model.

**inputSchema** (required, Zod Schema | JSON Schema): The schema of input the tool expects. The language model uses this to generate input and validate output. Use descriptions to make input understandable for the model.

**execute** (optional, async function): Called with tool call arguments and produces a result or results iterable. Signature: `async (input: INPUT, options: ToolCallOptions) => RESULT | Promise<RESULT> | AsyncIterable<RESULT>`. If not provided, the tool won't be executed automatically.
- **ToolCallOptions** parameters:
  - **toolCallId** (string): ID of the tool call for tracking.
  - **messages** (ModelMessage[]): Messages sent to the model that initiated the tool call (excludes system prompt and assistant response).
  - **abortSignal** (optional, AbortSignal): Signal to abort the operation.
  - **experimental_context** (optional, unknown): Experimental context passed into tool execution.

**outputSchema** (optional, Zod Schema | JSON Schema): Schema of the tool's output for validation and type inference.

**toModelOutput** (optional, function): Converts tool result to output for the language model. Signature: `(output: RESULT) => LanguageModelV3ToolResultPart['output']`. If not provided, result is sent as JSON.

**onInputStart** (optional, function): Called when argument streaming starts in streaming context.

**onInputDelta** (optional, function): Called when argument streaming delta is available. Signature: `(options: { inputTextDelta: string } & ToolCallOptions) => void | PromiseLike<void>`.

**onInputAvailable** (optional, function): Called when tool call can be started, even without execute function. Signature: `(options: { input: INPUT } & ToolCallOptions) => void | PromiseLike<void>`.

**providerOptions** (optional, ProviderOptions): Additional provider-specific metadata for provider-specific functionality.

**type** (optional, 'function' | 'provider-defined'): Tool type. Defaults to "function". Use "provider-defined" for provider-specific tools.

**id** (optional, string): ID for provider-defined tools in format `<provider-name>.<unique-tool-name>`. Required when type is "provider-defined".

**name** (optional, string): Name of the tool for provider-defined tools. Required when type is "provider-defined".

**args** (optional, Record<string, unknown>): Arguments for configuring provider-defined tools.

## Returns
The tool object that was passed in.