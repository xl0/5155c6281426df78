## generateSpeech()

Generates speech audio from text using various AI providers.

**Status**: Experimental feature

**Basic Usage**:
```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});
```

**Provider Examples**:
- OpenAI: `openai.speech('tts-1')` with voice 'alloy'
- ElevenLabs: `elevenlabs.speech('eleven_multilingual_v2')` with voice ID from account

**Parameters**:
- `model` (required): SpeechModelV3 - the speech model to use
- `text` (required): string - text to generate speech from
- `voice` (optional): string - voice identifier
- `outputFormat` (optional): string - output format like "mp3", "wav"
- `instructions` (optional): string - generation instructions
- `speed` (optional): number - speech generation speed
- `language` (optional): string - ISO 639-1 language code or "auto" for detection
- `providerOptions` (optional): Record<string, JSONObject> - provider-specific options
- `maxRetries` (optional): number - default 2
- `abortSignal` (optional): AbortSignal - for cancellation
- `headers` (optional): Record<string, string> - HTTP headers

**Returns**:
- `audio`: GeneratedAudioFile object containing:
  - `base64`: string - base64 encoded audio
  - `uint8Array`: Uint8Array - audio as bytes
  - `mimeType`: string - MIME type (e.g. "audio/mpeg")
  - `format`: string - format (e.g. "mp3")
- `warnings`: Warning[] - provider warnings
- `responses`: SpeechModelResponseMetadata[] - response metadata with timestamp, modelId, body, headers