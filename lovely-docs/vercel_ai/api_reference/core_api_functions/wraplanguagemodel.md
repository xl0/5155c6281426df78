## wrapLanguageModel()

Wraps a language model with middleware to enhance its behavior.

### Usage

```ts
import { wrapLanguageModel } from 'ai';

const wrappedLanguageModel = wrapLanguageModel({
  model: 'openai/gpt-4.1',
  middleware: yourLanguageModelMiddleware,
});
```

### Parameters

- **model** (LanguageModelV3): The original language model instance to wrap.
- **middleware** (LanguageModelV3Middleware | LanguageModelV3Middleware[]): Middleware to apply. Multiple middlewares are chained with the first transforming input first and the last wrapping directly around the model.
- **modelId** (string, optional): Custom model ID to override the original.
- **providerId** (string, optional): Custom provider ID to override the original.

### Returns

A new LanguageModelV3 instance with middleware applied.