## LanguageModelV3Middleware

Experimental middleware system for intercepting and modifying language model calls in a model-agnostic way.

### Purpose
Enables enhancement of language model behavior through middleware patterns. Common use cases include guardrails, RAG (Retrieval-Augmented Generation), caching, and logging.

### API

**transformParams**
- Type: `({ type: "generate" | "stream", params: LanguageModelV3CallOptions }) => Promise<LanguageModelV3CallOptions>`
- Transforms parameters before passing to the language model

**wrapGenerate**
- Type: `({ doGenerate: DoGenerateFunction, params: LanguageModelV3CallOptions, model: LanguageModelV3 }) => Promise<DoGenerateResult>`
- Wraps the generate operation of the language model

**wrapStream**
- Type: `({ doStream: DoStreamFunction, params: LanguageModelV3CallOptions, model: LanguageModelV3 }) => Promise<DoStreamResult>`
- Wraps the stream operation of the language model

### Import
```javascript
import { LanguageModelV3Middleware } from "ai"
```

**Note:** This is an experimental feature.