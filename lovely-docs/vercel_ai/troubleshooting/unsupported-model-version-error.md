## Issue
When migrating to AI SDK 5, you may encounter `AI_UnsupportedModelVersionError` stating that your model uses an unsupported version:
```
AI_UnsupportedModelVersionError: Unsupported model version v1 for provider "ollama.chat" and model "gamma3:4b".
AI SDK 5 only supports models that implement specification version "v2".
```

This occurs because your provider package implements the older v1 model specification.

## Root Cause
AI SDK 5 requires all provider packages to implement specification version v2. Upgrading to AI SDK 5 without updating provider packages leaves them on v1 specification, causing the error.

## Solution
Update all `@ai-sdk/*` provider packages to compatible versions:

```bash
pnpm install ai@latest @ai-sdk/openai@latest @ai-sdk/anthropic@latest
```

Required versions for AI SDK 5 compatibility:
- `ai` package: `5.0.0` or later
- `@ai-sdk/*` packages: `2.0.0` or later (e.g., `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`)
- `@ai-sdk/provider` package: `2.0.0` or later
- `zod` package: `4.1.8` or later

For third-party or custom providers, verify v2 support by:
1. Checking provider's package.json for `@ai-sdk/provider` peer dependency version `2.0.0` or later
2. Reviewing provider's changelog or migration guide
3. Checking provider's repository for AI SDK 5 support