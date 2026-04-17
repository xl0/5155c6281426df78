## generateObject()

Generates typed, structured objects from language models using schemas for information extraction, synthetic data generation, and classification tasks.

### Core Functionality

The function forces language models to return structured data validated against a schema. It supports multiple output types:
- **object**: Single structured object (default)
- **array**: Array of objects matching a schema
- **enum**: Selection from predefined values
- **no-schema**: Unstructured JSON output

### Examples

**Generate object with Zod schema:**
```ts
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
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
```

**Generate array:**
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z.string().describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});
```

**Generate enum:**
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole..."',
});
```

**Generate JSON without schema:**
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

### Parameters

**Required:**
- `model`: Language model instance
- `prompt` or `messages`: Input text or message array

**Schema Configuration:**
- `schema`: Zod or JSON schema describing output shape (not for 'no-schema' or 'enum')
- `schemaName`: Optional name for provider guidance
- `schemaDescription`: Optional description for provider guidance
- `output`: Output type ('object' | 'array' | 'enum' | 'no-schema'), defaults to 'object'
- `enum`: Array of possible values (only for 'enum' output)
- `mode`: Generation mode ('auto' | 'json' | 'tool'), defaults to 'auto' for objects, 'json' for no-schema

**System & Messages:**
- `system`: System prompt string or SystemModelMessage
- `messages`: Array of conversation messages (SystemModelMessage, UserModelMessage, AssistantModelMessage, ToolModelMessage)

**User Messages** can contain:
- `TextPart`: `{ type: 'text', text: string }`
- `ImagePart`: `{ type: 'image', image: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType?: string }`
- `FilePart`: `{ type: 'file', data: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType: string }`

**Assistant Messages** can contain:
- `TextPart`, `ReasoningPart`, `FilePart`, `ToolCallPart`

**Tool Messages** contain:
- `ToolResultPart`: `{ type: 'tool-result', toolCallId: string, toolName: string, result: unknown, isError?: boolean }`

**Generation Parameters:**
- `maxOutputTokens`: Maximum tokens to generate
- `temperature`: Sampling temperature (0-1 range depends on provider)
- `topP`: Nucleus sampling (alternative to temperature)
- `topK`: Sample from top K options
- `presencePenalty`: Penalize repeated information
- `frequencyPenalty`: Penalize repeated words/phrases
- `seed`: Integer for deterministic results

**Request Control:**
- `maxRetries`: Maximum retry attempts (default: 2)
- `abortSignal`: AbortSignal for cancellation
- `headers`: Additional HTTP headers
- `providerOptions`: Provider-specific options

**Advanced:**
- `experimental_repairText`: Function to repair malformed JSON output
- `experimental_download`: Custom URL download function
- `experimental_telemetry`: Telemetry configuration (isEnabled, recordInputs, recordOutputs, functionId, metadata)

### Return Value

- `object`: Generated object validated by schema
- `finishReason`: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
- `usage`: Token usage (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- `request`: Request metadata (body as string)
- `response`: Response metadata (id, modelId, timestamp, headers, body)
- `reasoning`: Concatenated reasoning text (if available)
- `warnings`: Provider warnings
- `providerMetadata`: Provider-specific metadata
- `toJsonResponse(init?)`: Converts to JSON Response with status 200