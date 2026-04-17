## Error Overview
`AI_TooManyEmbeddingValuesForCallError` is thrown when attempting to embed more values in a single call than the provider's model allows.

## Error Properties
- `provider`: The AI provider name
- `modelId`: The embedding model identifier
- `maxEmbeddingsPerCall`: Maximum embeddings allowed per call
- `values`: The array of values that exceeded the limit

## Detection
```typescript
import { TooManyEmbeddingValuesForCallError } from 'ai';

if (TooManyEmbeddingValuesForCallError.isInstance(error)) {
  // Handle the error
}
```