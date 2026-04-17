## Purpose
Rerank documents based on relevance to a query using a reranking model. Useful for improving search results by reordering documents, emails, or other content based on semantic understanding.

## Basic Usage
```ts
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
});
```

## Parameters
- `model` (RerankingModel): The reranking model to use, e.g., `cohere.reranking('rerank-v3.5')`
- `documents` (Array<VALUE>): Documents to rerank - can be strings or JSON objects
- `query` (string): Search query to rank documents against
- `topN` (number, optional): Maximum number of top documents to return; if not specified, all are returned
- `maxRetries` (number, optional): Maximum retries, default 2
- `abortSignal` (AbortSignal, optional): Cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers
- `providerOptions` (ProviderOptions, optional): Provider-specific options
- `experimental_telemetry` (TelemetrySettings, optional): Telemetry configuration with `isEnabled`, `recordInputs`, `recordOutputs`, `functionId`, `metadata`, and `tracer`

## Return Value
- `originalDocuments` (Array<VALUE>): Original documents in original order
- `rerankedDocuments` (Array<VALUE>): Documents sorted by relevance score (descending)
- `ranking` (Array<RankingItem<VALUE>>): Array of ranking items with:
  - `originalIndex` (number): Index in original array
  - `score` (number): Relevance score (typically 0-1, higher = more relevant)
  - `document` (VALUE): The document itself
- `response` (Response): Response metadata including `id`, `timestamp`, `modelId`, `headers`, `body`
- `providerMetadata` (ProviderMetadata, optional): Provider-specific metadata

## Examples

### String Documents
```ts
const { ranking, rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
  query: 'talk about rain',
  topN: 2,
});

console.log(rerankedDocuments);
// ['rainy afternoon in the city', 'sunny day at the beach']

console.log(ranking);
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon...' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day...' }
// ]
```

### Object Documents
```ts
const documents = [
  {
    from: 'Paul Doe',
    subject: 'Follow-up',
    text: 'We are happy to give you a discount of 20%.',
  },
  {
    from: 'John McGill',
    subject: 'Missing Info',
    text: 'Here is the pricing from Oracle: $5000/month',
  },
];

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});

console.log(ranking[0].document);
// { from: 'John McGill', subject: 'Missing Info', ... }
```

### With Provider Options
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  providerOptions: {
    cohere: {
      maxTokensPerDoc: 1000,
    },
  },
});
```