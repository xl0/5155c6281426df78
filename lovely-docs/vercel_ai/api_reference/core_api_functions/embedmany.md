## embedMany()

Embed multiple values using an embedding model. The function automatically chunks large requests if the model has embedding limits.

### Basic Usage

```ts
import { embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

### Parameters

- **model** (EmbeddingModel): The embedding model to use. Example: `openai.embeddingModel('text-embedding-3-small')`
- **values** (Array<VALUE>): The values to embed. Type depends on the model.
- **maxRetries** (number, optional): Maximum retry attempts. Default: 2. Set to 0 to disable.
- **abortSignal** (AbortSignal, optional): Signal to cancel the call.
- **headers** (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers.
- **experimental_telemetry** (TelemetrySettings, optional): Telemetry configuration with options:
  - **isEnabled** (boolean, optional): Enable/disable telemetry. Disabled by default.
  - **recordInputs** (boolean, optional): Record inputs. Enabled by default.
  - **recordOutputs** (boolean, optional): Record outputs. Enabled by default.
  - **functionId** (string, optional): Identifier to group telemetry by function.
  - **metadata** (Record<string, ...>, optional): Additional telemetry metadata.
  - **tracer** (Tracer, optional): Custom tracer for telemetry.

### Returns

- **values** (Array<VALUE>): The values that were embedded.
- **embeddings** (number[][]): The embeddings in the same order as input values.
- **usage** (EmbeddingModelUsage): Token usage with:
  - **tokens** (number): Total input tokens.
  - **body** (unknown, optional): Response body.
- **providerMetadata** (ProviderMetadata | undefined, optional): Provider-specific metadata.