## Embeddings

Embeddings represent words, phrases, or images as vectors in high-dimensional space where similar items are close together.

### Single Value Embedding

```ts
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

### Batch Embedding

```ts
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

### Similarity Calculation

```ts
import { cosineSimilarity, embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});

console.log(`cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`);
```

### Token Usage

```ts
const { embedding, usage } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
console.log(usage); // { tokens: 10 }
```

### Configuration Options

**Provider Options** - Pass provider-specific settings via `providerOptions`:
```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  providerOptions: {
    openai: { dimensions: 512 },
  },
});
```

**Parallel Requests** - Control concurrency with `maxParallelCalls`:
```ts
const { embeddings } = await embedMany({
  maxParallelCalls: 2,
  model: 'openai/text-embedding-3-small',
  values: ['...', '...', '...'],
});
```

**Retries** - Set `maxRetries` (defaults to 2):
```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  maxRetries: 0,
});
```

**Abort Signals & Timeouts**:
```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  abortSignal: AbortSignal.timeout(1000),
});
```

**Custom Headers**:
```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### Response Information

Both `embed` and `embedMany` return a `response` property with raw provider response:
```ts
const { embedding, response } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

### Embedding Middleware

Wrap embedding models with middleware to set defaults:
```ts
import { wrapEmbeddingModel, defaultEmbeddingSettingsMiddleware, gateway } from 'ai';

const embeddingModelWithDefaults = wrapEmbeddingModel({
  model: gateway.embeddingModel('google/gemini-embedding-001'),
  middleware: defaultEmbeddingSettingsMiddleware({
    settings: {
      providerOptions: {
        google: {
          outputDimensionality: 256,
          taskType: 'CLASSIFICATION',
        },
      },
    },
  }),
});
```

### Available Embedding Models

| Provider | Model | Dimensions |
|----------|-------|-----------|
| OpenAI | text-embedding-3-large | 3072 |
| OpenAI | text-embedding-3-small | 1536 |
| OpenAI | text-embedding-ada-002 | 1536 |
| Google Generative AI | gemini-embedding-001 | 3072 |
| Google Generative AI | text-embedding-004 | 768 |
| Mistral | mistral-embed | 1024 |
| Cohere | embed-english-v3.0 | 1024 |
| Cohere | embed-multilingual-v3.0 | 1024 |
| Cohere | embed-english-light-v3.0 | 384 |
| Cohere | embed-multilingual-light-v3.0 | 384 |
| Cohere | embed-english-v2.0 | 4096 |
| Cohere | embed-english-light-v2.0 | 1024 |
| Cohere | embed-multilingual-v2.0 | 768 |
| Amazon Bedrock | amazon.titan-embed-text-v1 | 1536 |
| Amazon Bedrock | amazon.titan-embed-text-v2:0 | 1024 |