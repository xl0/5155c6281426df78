## defaultSettingsMiddleware

Middleware function that applies default settings to language model calls, enabling consistent default parameters across multiple invocations.

### Import
```ts
import { defaultSettingsMiddleware } from 'ai';
```

### API

**Parameters:**
- `settings`: Object containing default parameter values (any valid `LanguageModelV3CallOptions` properties and optional provider metadata)

**Returns:** Middleware object that merges defaults with call parameters, with explicit parameters taking precedence over defaults, and provider metadata objects merged.

### Examples

Basic usage with default settings:
```ts
const middleware = defaultSettingsMiddleware({
  settings: {
    temperature: 0.7,
    maxOutputTokens: 1000,
  },
});
```

With model wrapping and provider options:
```ts
import { streamText, wrapLanguageModel, defaultSettingsMiddleware } from 'ai';

const modelWithDefaults = wrapLanguageModel({
  model: gateway('anthropic/claude-sonnet-4.5'),
  middleware: defaultSettingsMiddleware({
    settings: {
      providerOptions: {
        openai: {
          reasoningEffort: 'high',
        },
      },
    },
  }),
});

const result = await streamText({
  model: modelWithDefaults,
  prompt: 'Your prompt here',
  temperature: 0.8, // overrides default
});
```

### How It Works

1. Takes default settings as configuration
2. Merges defaults with parameters in each model call
3. Ensures explicitly provided parameters take precedence
4. Merges provider metadata objects from both sources