## Overview
The `generateImage` function generates images from text prompts using image models from various providers (OpenAI, Google Vertex, Fal, etc.).

## Basic Usage
```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});

const base64 = image.base64;
const uint8Array = image.uint8Array;
```

## Size and Aspect Ratio
Specify size as `{width}x{height}` (e.g., `'1024x1024'`) or aspect ratio as `{width}:{height}` (e.g., `'16:9'`). Supported values vary by model and provider.

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  size: '1024x1024',
});

const { image } = await generateImage({
  model: vertex.image('imagen-3.0-generate-002'),
  prompt: 'Santa Claus driving a Cadillac',
  aspectRatio: '16:9',
});
```

## Multiple Images
Use the `n` parameter to generate multiple images. The SDK automatically batches requests based on model limits (e.g., DALL-E 3 generates 1 per call, DALL-E 2 up to 10). Override with `maxImagesPerCall`:

```tsx
const { images } = await generateImage({
  model: openai.image('dall-e-2'),
  prompt: 'Santa Claus driving a Cadillac',
  n: 4,
});

const { images } = await generateImage({
  model: openai.image('dall-e-2'),
  prompt: 'Santa Claus driving a Cadillac',
  maxImagesPerCall: 5,
  n: 10, // Makes 2 calls of 5 images each
});
```

## Seed
Provide a seed to control reproducibility (if supported by model):

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  seed: 1234567890,
});
```

## Provider-Specific Settings
Pass model-specific options via `providerOptions`:

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  size: '1024x1024',
  providerOptions: {
    openai: { style: 'vivid', quality: 'hd' },
  },
});
```

## Abort Signals and Timeouts
Use `abortSignal` to abort or timeout requests:

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  abortSignal: AbortSignal.timeout(1000),
});
```

## Custom Headers
Add custom headers via the `headers` parameter:

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

## Warnings and Metadata
Access warnings and provider-specific metadata:

```tsx
const { image, warnings } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});

const { image, providerMetadata } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});

const revisedPrompt = providerMetadata.openai.images[0]?.revisedPrompt;
```

## Error Handling
Catch `AI_NoImageGeneratedError` when generation fails:

```tsx
import { generateImage, NoImageGeneratedError } from 'ai';

try {
  await generateImage({ model, prompt });
} catch (error) {
  if (NoImageGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

## Language Models with Image Output
Some language models (e.g., `gemini-2.5-flash-image-preview`) support multi-modal outputs. Access generated images via the `files` property:

```tsx
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const result = await generateText({
  model: google('gemini-2.5-flash-image-preview'),
  prompt: 'Generate an image of a comic cat',
});

for (const file of result.files) {
  if (file.mediaType.startsWith('image/')) {
    const base64 = file.base64;
    const uint8Array = file.uint8Array;
    const mediaType = file.mediaType;
  }
}
```

## Supported Image Models
Comprehensive table of image models from providers including xAI Grok, OpenAI (gpt-image-1, dall-e-3, dall-e-2), Amazon Bedrock, Fal, DeepInfra, Replicate, Google, Google Vertex, Fireworks, Luma, Together.ai, and Black Forest Labs. Each model lists supported sizes or aspect ratios.