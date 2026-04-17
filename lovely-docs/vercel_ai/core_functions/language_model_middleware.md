Language model middleware intercepts and modifies language model calls to add features like guardrails, RAG, caching, and logging in a model-agnostic way.

**Using Middleware:**
Wrap a model with `wrapLanguageModel()`:
```ts
import { wrapLanguageModel } from 'ai';
const wrapped = wrapLanguageModel({ model: yourModel, middleware: yourMiddleware });
// Use like any other model in streamText, generateText, etc.
```

Multiple middlewares are applied in order: `wrapLanguageModel({ model, middleware: [first, second] })` applies as `first(second(model))`.

**Built-in Middleware:**
- `extractReasoningMiddleware({ tagName: 'think' })`: Extracts reasoning from special tags and exposes as `reasoning` property. Option `startWithReasoning: true` prepends the tag.
- `simulateStreamingMiddleware()`: Simulates streaming for non-streaming models.
- `defaultSettingsMiddleware({ settings: { temperature, maxOutputTokens, providerOptions } })`: Applies default settings.

**Community Middleware:**
- Custom tool call parser (`@ai-sdk-tool/parser`): Enables function calling on models without native support via `createToolMiddleware()`, `hermesToolMiddleware`, or `gemmaToolMiddleware`. Example: `wrapLanguageModel({ model: openrouter('google/gemma-3-27b-it'), middleware: gemmaToolMiddleware })`.

**Implementing Custom Middleware:**
Implement `LanguageModelV3Middleware` with any of:
1. `transformParams({ params })`: Modify parameters before passing to model (for both generate and stream).
2. `wrapGenerate({ doGenerate, params })`: Wrap the generate method, modify params/result.
3. `wrapStream({ doStream, params })`: Wrap the stream method, modify params/result.

**Examples:**

Logging:
```ts
export const logMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('params:', JSON.stringify(params, null, 2));
    const result = await doGenerate();
    console.log('text:', result.text);
    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    console.log('params:', JSON.stringify(params, null, 2));
    const { stream, ...rest } = await doStream();
    let generatedText = '';
    const textBlocks = new Map<string, string>();
    const transformStream = new TransformStream<LanguageModelV3StreamPart, LanguageModelV3StreamPart>({
      transform(chunk, controller) {
        if (chunk.type === 'text-start') textBlocks.set(chunk.id, '');
        else if (chunk.type === 'text-delta') {
          const existing = textBlocks.get(chunk.id) || '';
          textBlocks.set(chunk.id, existing + chunk.delta);
          generatedText += chunk.delta;
        } else if (chunk.type === 'text-end') console.log(`Block ${chunk.id}:`, textBlocks.get(chunk.id));
        controller.enqueue(chunk);
      },
      flush() { console.log('text:', generatedText); }
    });
    return { stream: stream.pipeThrough(transformStream), ...rest };
  }
};
```

Caching:
```ts
const cache = new Map<string, any>();
export const cacheMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const key = JSON.stringify(params);
    if (cache.has(key)) return cache.get(key);
    const result = await doGenerate();
    cache.set(key, result);
    return result;
  }
};
```

RAG (transformParams approach):
```ts
export const ragMiddleware: LanguageModelV3Middleware = {
  transformParams: async ({ params }) => {
    const text = getLastUserMessageText({ prompt: params.prompt });
    if (!text) return params;
    const instruction = 'Use this info:\n' + findSources({ text }).map(c => JSON.stringify(c)).join('\n');
    return addToLastUserMessage({ params, text: instruction });
  }
};
```

Guardrails (filtering):
```ts
export const guardrailMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate }) => {
    const { text, ...rest } = await doGenerate();
    return { text: text?.replace(/badword/g, '<REDACTED>'), ...rest };
  }
};
```

**Custom Metadata Per Request:**
Pass metadata via `providerOptions` and access in middleware:
```ts
export const logMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('METADATA', params?.providerMetadata?.logMiddleware);
    return doGenerate();
  }
};

const { text } = await generateText({
  model: wrapLanguageModel({ model: 'anthropic/claude-sonnet-4.5', middleware: logMiddleware }),
  prompt: 'Invent a new holiday...',
  providerOptions: { logMiddleware: { hello: 'world' } }
});
```