## Generating Structured Data

The AI SDK provides `generateObject` and `streamObject` functions to standardize structured data generation across model providers. Both support different output strategies (`array`, `object`, `enum`, `no-schema`) and generation modes (`auto`, `tool`, `json`). Schemas can be defined using Zod, Valibot, or JSON schemas.

### generateObject

Generates structured data from a prompt with schema validation:

```ts
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

Access response headers and body via `result.response.headers` and `result.response.body`.

### streamObject

Streams the model's response as it's generated for better interactivity:

```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({ /* ... */ }),
  prompt: 'Generate data.',
  onError({ error }) {
    console.error(error);
  },
});

for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

Errors are part of the stream; use `onError` callback for logging.

### Output Strategies

**Object** (default): Returns generated data as an object.

**Array**: Generate array of objects; schema specifies element shape. With `streamObject`, use `elementStream`:

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

**Enum**: Generate specific enum value for classification (generateObject only):

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole in search of a new habitable planet for humanity."',
});
```

**No Schema**: Omit schema for dynamic user requests:

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

### Schema Configuration

Optionally specify `schemaName` and `schemaDescription` for additional LLM guidance:

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schemaName: 'Recipe',
  schemaDescription: 'A recipe for a dish.',
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

### Accessing Reasoning

Access model reasoning via `result.reasoning` (if available):

```ts
import { OpenAIResponsesProviderOptions } from '@ai-sdk/openai';

const result = await generateObject({
  model: 'openai/gpt-5',
  schema: z.object({ /* ... */ }),
  prompt: 'Generate a lasagna recipe.',
  providerOptions: {
    openai: {
      strictJsonSchema: true,
      reasoningSummary: 'detailed',
    } satisfies OpenAIResponsesProviderOptions,
  },
});

console.log(result.reasoning);
```

### Error Handling

`generateObject` throws `AI_NoObjectGeneratedError` when it cannot generate a valid object. The error preserves:
- `text`: Generated text (raw or tool call)
- `response`: Metadata (id, timestamp, model)
- `usage`: Token usage
- `cause`: Underlying error (JSON parsing, validation, etc.)

```ts
import { generateObject, NoObjectGeneratedError } from 'ai';

try {
  await generateObject({ model, schema, prompt });
} catch (error) {
  if (NoObjectGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Text:', error.text);
    console.log('Response:', error.response);
    console.log('Usage:', error.usage);
  }
}
```

### Repairing Invalid JSON

Experimental `experimental_repairText` function attempts to repair malformed JSON:

```ts
const { object } = await generateObject({
  model,
  schema,
  prompt,
  experimental_repairText: async ({ text, error }) => {
    return text + '}'; // example: add closing brace
  },
});
```

### Structured Outputs with generateText and streamText

Use `output` setting with `generateText` and `streamText` for structured data generation.

**generateText**:

```ts
const { output } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable().describe('Age of the person.'),
      contact: z.object({
        type: z.literal('email'),
        value: z.string(),
      }),
      occupation: z.object({
        type: z.literal('employed'),
        company: z.string(),
        position: z.string(),
      }),
    }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

**streamText**:

```ts
const { partialOutputStream } = await streamText({
  model: 'anthropic/claude-sonnet-4.5',
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable(),
      contact: z.object({
        type: z.literal('email'),
        value: z.string(),
      }),
      occupation: z.object({
        type: z.literal('employed'),
        company: z.string(),
        position: z.string(),
      }),
    }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

### Output Types

**Output.text()**: Generate plain text without schema enforcement:

```ts
const { output } = await generateText({
  output: Output.text(),
  prompt: 'Tell me a joke.',
});
// output is a string
```

**Output.object()**: Generate structured object with schema validation:

```ts
const { output } = await generateText({
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable(),
      labels: z.array(z.string()),
    }),
  }),
  prompt: 'Generate information for a test user.',
});
// output matches schema; partial outputs also validated
```

**Output.array()**: Generate array of typed objects:

```ts
const { output } = await generateText({
  output: Output.array({
    element: z.object({
      location: z.string(),
      temperature: z.number(),
      condition: z.string(),
    }),
  }),
  prompt: 'List the weather for San Francisco and Paris.',
});
// output: [
//   { location: 'San Francisco', temperature: 70, condition: 'Sunny' },
//   { location: 'Paris', temperature: 65, condition: 'Cloudy' },
// ]
```

**Output.choice()**: Choose from specific string options for classification:

```ts
const { output } = await generateText({
  output: Output.choice({
    options: ['sunny', 'rainy', 'snowy'],
  }),
  prompt: 'Is the weather sunny, rainy, or snowy today?',
});
// output is one of: 'sunny', 'rainy', or 'snowy'
```

**Output.json()**: Generate and parse unstructured JSON without schema validation:

```ts
const { output } = await generateText({
  output: Output.json(),
  prompt: 'For each city, return the current temperature and weather condition as a JSON object.',
});
// output could be any valid JSON, e.g.:
// {
//   "San Francisco": { "temperature": 70, "condition": "Sunny" },
//   "Paris": { "temperature": 65, "condition": "Cloudy" }
// }
```