## Transcription

The AI SDK provides the `transcribe` function (imported as `experimental_transcribe`) to transcribe audio using various transcription models.

### Basic Usage

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

// Access results
const text = transcript.text; // e.g. "Hello, world!"
const segments = transcript.segments; // array with start/end times (if available)
const language = transcript.language; // e.g. "en" (if available)
const durationInSeconds = transcript.durationInSeconds; // (if available)
```

The `audio` property accepts: `Uint8Array`, `ArrayBuffer`, `Buffer`, base64-encoded string, or URL.

### Provider-Specific Settings

```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  providerOptions: {
    openai: {
      timestampGranularities: ['word'],
    },
  },
});
```

### Abort Signals and Timeouts

```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  abortSignal: AbortSignal.timeout(1000), // Abort after 1 second
});
```

### Custom Headers

```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### Warnings

```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

const warnings = transcript.warnings; // unsupported parameters, etc.
```

### Error Handling

When transcription fails, `transcribe` throws `AI_NoTranscriptGeneratedError`. This can occur if the model fails to generate a response or the response cannot be parsed.

```ts
import { experimental_transcribe as transcribe, NoTranscriptGeneratedError } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

try {
  await transcribe({
    model: openai.transcription('whisper-1'),
    audio: await readFile('audio.mp3'),
  });
} catch (error) {
  if (NoTranscriptGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses); // metadata about model responses
  }
}
```

### Supported Models

OpenAI: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`
ElevenLabs: `scribe_v1`, `scribe_v1_experimental`
Groq: `whisper-large-v3-turbo`, `distil-whisper-large-v3-en`, `whisper-large-v3`
Azure OpenAI: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`
Rev.ai: `machine`, `low_cost`, `fusion`
Deepgram: `base`, `enhanced`, `nova`, `nova-2`, `nova-3` (with variants)
Gladia: `default`
AssemblyAI: `best`, `nano`
Fal: `whisper`, `wizper`

**Note:** Transcription is an experimental feature.