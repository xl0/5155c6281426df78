## Overview
AI SDK uses OpenTelemetry to collect telemetry data. The feature is experimental and may change. For Next.js apps, enable OpenTelemetry first via the Next.js guide.

## Enabling Telemetry
Use the `experimental_telemetry` option on function calls:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

Control input/output recording with `recordInputs` and `recordOutputs` (both enabled by default). Disable for privacy/performance reasons.

## Telemetry Metadata
Provide `functionId` to identify the function and `metadata` for additional context:
```ts
experimental_telemetry: {
  isEnabled: true,
  functionId: 'my-awesome-function',
  metadata: {
    something: 'custom',
    someOtherThing: 'other-value',
  },
}
```

## Custom Tracer
Provide a custom `tracer` returning an OpenTelemetry `Tracer` to use a different `TracerProvider`:
```ts
const tracerProvider = new NodeTracerProvider();
experimental_telemetry: {
  isEnabled: true,
  tracer: tracerProvider.getTracer('ai'),
}
```

## Collected Data

### generateText
Records 3 span types:
- `ai.generateText`: full call span with `operation.name`, `ai.operationId`, `ai.prompt`, `ai.response.text`, `ai.response.toolCalls`, `ai.response.finishReason`, `ai.settings.maxOutputTokens`
- `ai.generateText.doGenerate`: provider call span with `ai.prompt.messages`, `ai.prompt.tools`, `ai.prompt.toolChoice`, response attributes
- `ai.toolCall`: tool call spans (see Tool call spans section)

### streamText
Records 3 span types and 2 event types:
- `ai.streamText`: full call span with prompt, response text/toolCalls/finishReason, maxOutputTokens
- `ai.streamText.doStream`: provider call span with messages, tools, toolChoice, response text/toolCalls, `ai.response.msToFirstChunk`, `ai.response.msToFinish`, `ai.response.avgCompletionTokensPerSecond`
- `ai.toolCall`: tool call spans
- `ai.stream.firstChunk` event: emitted when first chunk received, contains `ai.response.msToFirstChunk`
- `ai.stream.finish` event: emitted when finish part received

### generateObject
Records 2 span types:
- `ai.generateObject`: full call span with `ai.prompt`, `ai.schema`, `ai.schema.name`, `ai.schema.description`, `ai.response.object`, `ai.settings.output`
- `ai.generateObject.doGenerate`: provider call span with `ai.prompt.messages`, `ai.response.object`, `ai.response.finishReason`

### streamObject
Records 2 span types and 1 event type:
- `ai.streamObject`: full call span with prompt, schema, schema name/description, response object, output setting
- `ai.streamObject.doStream`: provider call span with messages, response object, `ai.response.msToFirstChunk`, finishReason
- `ai.stream.firstChunk` event: contains `ai.response.msToFirstChunk`

### embed
Records 2 span types:
- `ai.embed`: full call span with `ai.value`, `ai.embedding`
- `ai.embed.doEmbed`: provider call span with `ai.values`, `ai.embeddings`

### embedMany
Records 2 span types:
- `ai.embedMany`: full call span with `ai.values`, `ai.embeddings`
- `ai.embedMany.doEmbed`: provider call span with `ai.values`, `ai.embeddings`

## Span Attributes

### Basic LLM span information
Common to most LLM spans: `resource.name`, `ai.model.id`, `ai.model.provider`, `ai.request.headers.*`, `ai.response.providerMetadata`, `ai.settings.maxRetries`, `ai.telemetry.functionId`, `ai.telemetry.metadata.*`, `ai.usage.completionTokens`, `ai.usage.promptTokens`

### Call LLM span information
Individual LLM call spans include basic LLM info plus: `ai.response.model`, `ai.response.id`, `ai.response.timestamp`, and OpenTelemetry GenAI semantic conventions (`gen_ai.system`, `gen_ai.request.model`, `gen_ai.request.temperature`, `gen_ai.request.max_tokens`, `gen_ai.request.frequency_penalty`, `gen_ai.request.presence_penalty`, `gen_ai.request.top_k`, `gen_ai.request.top_p`, `gen_ai.request.stop_sequences`, `gen_ai.response.finish_reasons`, `gen_ai.response.model`, `gen_ai.response.id`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`)

### Basic embedding span information
Common to embedding spans: `ai.model.id`, `ai.model.provider`, `ai.request.headers.*`, `ai.settings.maxRetries`, `ai.telemetry.functionId`, `ai.telemetry.metadata.*`, `ai.usage.tokens`, `resource.name`

### Tool call spans
Tool call spans contain: `operation.name` ("ai.toolCall"), `ai.operationId` ("ai.toolCall"), `ai.toolCall.name`, `ai.toolCall.id`, `ai.toolCall.args`, `ai.toolCall.result` (if successful and serializable)