## cosineSimilarity()

Calculates the cosine similarity between two vectors. Returns a number between -1 and 1, where values close to 1 indicate very similar vectors and values close to -1 indicate different vectors.

### Usage

```ts
import { cosineSimilarity, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});

console.log(`cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`);
```

### API

**Parameters:**
- `vector1` (number[]): The first vector to compare
- `vector2` (number[]): The second vector to compare

**Returns:** number between -1 and 1 representing cosine similarity

**Import:** `import { cosineSimilarity } from "ai"`