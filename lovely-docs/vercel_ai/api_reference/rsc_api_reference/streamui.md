## streamUI

Helper function to create streamable UI from LLM providers. Similar to AI SDK Core APIs with same model interfaces.

### Import
```javascript
import { streamUI } from "@ai-sdk/rsc"
```

### Parameters

**Core inputs:**
- `model` (LanguageModel): Language model to use, e.g. `openai("gpt-4.1")`
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `prompt` (string): Input prompt to generate text from
- `messages` (Array): Conversation messages - CoreSystemMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage, or UIMessage from useChat hook
  - CoreUserMessage content can include TextPart, ImagePart (base64/data URL/http(s) URL), or FilePart
  - CoreAssistantMessage content can include TextPart or ToolCallPart
  - CoreToolMessage content contains ToolResultPart with tool execution results
- `initial` (ReactNode, optional): Initial UI to render

**Generation options:**
- `maxOutputTokens` (number, optional): Maximum tokens to generate
- `temperature` (number, optional): Temperature setting (recommend setting either temperature or topP, not both)
- `topP` (number, optional): Nucleus sampling
- `topK` (number, optional): Sample from top K options per token
- `presencePenalty` (number, optional): Affects likelihood of repeating prompt information
- `frequencyPenalty` (number, optional): Affects likelihood of repeating same words/phrases
- `stopSequences` (string[], optional): Sequences that stop generation
- `seed` (number, optional): Integer seed for deterministic results if supported

**Tool configuration:**
- `tools` (ToolSet, optional): Tools accessible to model with:
  - `description` (string, optional): Purpose and usage details
  - `parameters` (zod schema): Typed schema for tool parameters
  - `generate` (async function or AsyncGenerator, optional): Called with tool arguments, yields React nodes as UI
- `toolChoice` (optional): How tools are selected - "auto" (default), "none", "required", or `{ "type": "tool", "toolName": string }`

**Callbacks:**
- `text` (function, optional): Callback handling generated tokens with `{ content, delta, done }`
- `onFinish` (function, optional): Called when LLM response and tool executions complete, receives `{ usage: { promptTokens, completionTokens, totalTokens }, value: ReactNode, warnings?, response? }`

**Other:**
- `maxRetries` (number, optional): Max retries, default 2, set to 0 to disable
- `abortSignal` (AbortSignal, optional): Cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers
- `providerOptions` (Record<string, JSONObject>, optional): Provider-specific options

### Returns

- `value` (ReactNode): User interface based on stream output
- `response` (Response, optional): Response data with optional headers
- `warnings` (Warning[], optional): Provider warnings
- `stream` (AsyncIterable<StreamPart> & ReadableStream<StreamPart>): Stream with all events:
  - `{ type: 'text-delta', textDelta: string }`: Text delta
  - `{ type: 'tool-call', toolCallId, toolName, args }`: Tool call
  - `{ type: 'error', error: Error }`: Error during execution
  - `{ type: 'finish', finishReason, usage }`: Completion with reason ('stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown')

### Examples

1. **Render React component as function call** - Use streamUI with a model to generate and render React components based on LLM output
2. **Persist and restore UI/AI states** - Save and restore both UI state and AI state in Next.js applications
3. **Route React components** - Use language model to dynamically route between different React components
4. **Stream component updates** - Stream component updates to client in real-time

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production; migration guide available.