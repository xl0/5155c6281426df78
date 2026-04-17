## streamObject()

Streams a typed, structured object for a given prompt and schema using a language model. Forces the model to return structured data for information extraction, synthetic data generation, or classification tasks.

### Output Modes

- **'object'** (default): Stream a single typed object matching a schema
- **'array'**: Stream array elements individually; schema describes array items
- **'enum'**: Generate one of predefined enum values
- **'no-schema'**: Generate JSON without schema validation

### Generation Modes

- **'auto'** (default for 'object'): Automatically choose between json/tool modes
- **'json'**: Force JSON mode
- **'tool'**: Force tool/function calling mode (not available for 'no-schema')

### Examples

Stream object with schema:
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});

for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

Stream array elements:
```ts
const { elementStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z.string().describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});

for await (const hero of elementStream) {
  console.log(hero);
}
```

Generate JSON without schema:
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});

for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

Generate enum value:
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole in search of a new habitable planet for humanity."',
});
```

### Parameters

**Core:**
- `model` (LanguageModel): The language model to use
- `output` ('object' | 'array' | 'enum' | 'no-schema'): Type of output to generate
- `mode` ('auto' | 'json' | 'tool'): Generation mode
- `schema` (Zod Schema | JSON Schema): Describes the shape of object/array elements; not available with 'no-schema' or 'enum'
- `schemaName` (string): Optional name for additional LLM guidance
- `schemaDescription` (string): Optional description for additional LLM guidance
- `prompt` (string | message array): Input prompt
- `system` (string): System prompt
- `messages` (message array): Conversation messages with support for text, image, and file parts

**Sampling:**
- `temperature` (number): Controls randomness
- `topP` (number): Nucleus sampling
- `topK` (number): Sample from top K options
- `presencePenalty` (number): Penalizes repeating information from prompt
- `frequencyPenalty` (number): Penalizes repeated words/phrases
- `seed` (number): For deterministic results

**Limits & Control:**
- `maxOutputTokens` (number): Maximum tokens to generate
- `maxRetries` (number): Retry attempts (default: 2)
- `abortSignal` (AbortSignal): Cancel the call
- `headers` (Record<string, string>): Additional HTTP headers

**Advanced:**
- `experimental_repairText` (function): Repair malformed JSON output
- `experimental_download` (function): Custom URL download handler
- `experimental_telemetry` (TelemetrySettings): Enable telemetry with input/output recording and metadata
- `providerOptions` (Record<string, JSONObject>): Provider-specific options
- `onError` (callback): Called when error occurs
- `onFinish` (callback): Called when LLM response finishes; receives usage, metadata, final object, and errors

### Returns

**Promises:**
- `usage`: Token usage (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- `object`: Final generated object typed to schema
- `providerMetadata`: Provider-specific metadata
- `request`: Raw HTTP request body sent to provider
- `response`: Response metadata (id, model, timestamp, headers)

**Streams:**
- `partialObjectStream` (AsyncIterableStream<DeepPartial<T>>): Partial objects as they stream; not validated
- `elementStream` (AsyncIterableStream<ELEMENT>): Array elements (array mode only)
- `textStream` (AsyncIterableStream<string>): JSON text chunks
- `fullStream` (AsyncIterableStream<ObjectStreamPart<T>>): All events including object parts, text deltas, errors, and finish events with finishReason and logprobs

**Response Helpers:**
- `pipeTextStreamToResponse(response, init)`: Write text deltas to Node.js response with Content-Type text/plain
- `toTextStreamResponse(init)`: Create simple text stream Response

**Other:**
- `warnings`: Provider warnings (e.g. unsupported settings)