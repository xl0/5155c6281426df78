## embed()

Generate an embedding for a single value using an embedding model.

**Use case:** Embed a single value to retrieve similar items or use the embedding in downstream tasks.

**Example:**
```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

**Parameters:**
- `model` (EmbeddingModel, required): The embedding model to use. Example: `openai.embeddingModel('text-embedding-3-small')`
- `value` (VALUE, required): The value to embed. Type depends on the model.
- `maxRetries` (number, optional): Maximum number of retries. Default: 2. Set to 0 to disable.
- `abortSignal` (AbortSignal, optional): Cancel the call.
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers.
- `experimental_telemetry` (TelemetrySettings, optional): Telemetry configuration with options:
  - `isEnabled` (boolean): Enable/disable telemetry. Disabled by default.
  - `recordInputs` (boolean): Record inputs. Enabled by default.
  - `recordOutputs` (boolean): Record outputs. Enabled by default.
  - `functionId` (string): Identifier to group telemetry data.
  - `metadata` (Record<string, ...>): Additional telemetry data.
  - `tracer` (Tracer): Custom tracer for telemetry.

**Returns:**
- `value` (VALUE): The value that was embedded.
- `embedding` (number[]): The embedding vector.
- `usage` (EmbeddingModelUsage): Token usage with `tokens` (number).
- `response` (Response, optional): Response data with `headers` and `body`.
- `providerMetadata` (ProviderMetadata | undefined, optional): Provider-specific metadata.