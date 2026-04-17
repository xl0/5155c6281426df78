## customProvider()

Maps model IDs to any model, enabling custom model configurations, aliases, and wrapping existing providers with additional functionality.

### Parameters

- `languageModels` (optional): Record mapping model IDs to LanguageModel instances
- `embeddingModels` (optional): Record mapping model IDs to EmbeddingModel<string> instances
- `imageModels` (optional): Record mapping model IDs to ImageModel instances
- `fallbackProvider` (optional): Provider to use when a requested model is not found

### Returns

A Provider instance with methods:
- `languageModel(id: string) => LanguageModel`
- `embeddingModel(id: string) => EmbeddingModel<string>`
- `imageModel(id: string) => ImageModel`

### Example

```ts
import { openai } from '@ai-sdk/openai';
import { customProvider } from 'ai';

export const myOpenAI = customProvider({
  languageModels: {
    'gpt-4': wrapLanguageModel({
      model: openai('gpt-4'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
    'gpt-4o-reasoning-high': wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
  },
  fallbackProvider: openai,
});
```

This example creates a custom provider that wraps OpenAI models with custom settings (e.g., reasoning effort) and provides aliases for easier access.