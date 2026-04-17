## Overview
Generates a transcript from an audio file using a transcription model.

**Status**: Experimental feature

## Usage
```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const { text: transcript } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

console.log(transcript);
```

## Parameters
- `model` (TranscriptionModelV3): The transcription model to use
- `audio` (DataContent | URL): The audio file to transcribe (string, Uint8Array, ArrayBuffer, Buffer, or URL)
- `providerOptions` (Record<string, JSONObject>, optional): Additional provider-specific options
- `maxRetries` (number, optional): Maximum number of retries, default 2
- `abortSignal` (AbortSignal, optional): Signal to cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers

## Returns
- `text` (string): Complete transcribed text
- `segments` (Array): Transcript segments with text, startSecond, and endSecond
- `language` (string | undefined): ISO-639-1 language code (e.g., "en")
- `durationInSeconds` (number | undefined): Duration of audio in seconds
- `warnings` (Warning[]): Provider warnings
- `responses` (Array<TranscriptionModelResponseMetadata>): Provider response metadata including timestamp, modelId, and headers