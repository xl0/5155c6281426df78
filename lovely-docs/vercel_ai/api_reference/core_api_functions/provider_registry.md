## Overview
`createProviderRegistry()` creates a centralized registry for managing multiple AI providers and models, allowing access via simple string identifiers in the format `providerId:modelId`.

## Setup
Create a registry by passing an object with provider instances:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createProviderRegistry } from 'ai';

export const registry = createProviderRegistry({
  anthropic,
  openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
});
```

## Custom Separator
By default uses `:` as separator. Customize with the `separator` option:

```ts
const registry = createProviderRegistry(
  { anthropic, openai },
  { separator: ' > ' },
);
const model = registry.languageModel('anthropic > claude-3-opus-20240229');
```

## Accessing Models
The registry provides three methods to access different model types:

**Language models:**
```ts
const { text } = await generateText({
  model: registry.languageModel('openai:gpt-4.1'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Text embedding models:**
```ts
const { embedding } = await embed({
  model: registry.embeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```

**Image models:**
```ts
const { image } = await generateImage({
  model: registry.imageModel('openai:dall-e-3'),
  prompt: 'A beautiful sunset over a calm ocean',
});
```

## API
**Parameters:**
- `providers` (Record<string, Provider>): Object mapping provider IDs to provider instances. Each provider has `languageModel()`, `embeddingModel()`, and `imageModel()` methods.
- `options` (object, optional): Configuration object with `separator` (string, defaults to ":") to customize the provider:model delimiter.

**Returns:** Provider instance with methods:
- `languageModel(id: string) => LanguageModel`
- `embeddingModel(id: string) => EmbeddingModel<string>`
- `imageModel(id: string) => ImageModel`