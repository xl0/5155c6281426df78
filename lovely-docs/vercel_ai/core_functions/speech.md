## Speech Generation

The `generateSpeech` function converts text to audio using speech models.

### Basic Usage

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  voice: 'alloy',
});

const audioData = audio.audioData; // Uint8Array
```

### Language Setting

```ts
const audio = await generateSpeech({
  model: lmnt.speech('aurora'),
  text: 'Hola, mundo!',
  language: 'es', // Spanish
});
```

### Provider-Specific Settings

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  providerOptions: {
    openai: {
      // provider-specific options
    },
  },
});
```

### Abort Signals and Timeouts

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  abortSignal: AbortSignal.timeout(1000),
});
```

### Custom Headers

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### Warnings

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
});

const warnings = audio.warnings;
```

### Error Handling

Throws `AI_NoSpeechGeneratedError` when generation fails. The error includes `responses` (metadata about model responses) and `cause` (detailed error information).

```ts
import { experimental_generateSpeech as generateSpeech, NoSpeechGeneratedError } from 'ai';

try {
  await generateSpeech({
    model: openai.speech('tts-1'),
    text: 'Hello, world!',
  });
} catch (error) {
  if (NoSpeechGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

### Supported Models

OpenAI: `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`
ElevenLabs: `eleven_v3`, `eleven_multilingual_v2`, `eleven_flash_v2_5`, `eleven_flash_v2`, `eleven_turbo_v2_5`, `eleven_turbo_v2`
LMNT: `aurora`, `blizzard`
Hume: `default`

**Note:** Speech is an experimental feature.