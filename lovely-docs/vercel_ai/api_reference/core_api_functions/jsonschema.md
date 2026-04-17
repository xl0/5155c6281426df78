## Overview
`jsonSchema()` is a helper function that creates JSON schema objects compatible with the AI SDK. It's an alternative to Zod schemas, useful for dynamic situations like OpenAPI definitions or when using other validation libraries. Can be used for generating structured data and in tools.

## Usage
Takes a JSON schema definition and optional validation function, with TypeScript support:

```ts
import { jsonSchema } from 'ai';

const mySchema = jsonSchema<{
  recipe: {
    name: string;
    ingredients: { name: string; amount: string }[];
    steps: string[];
  };
}>({
  type: 'object',
  properties: {
    recipe: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              amount: { type: 'string' },
            },
            required: ['name', 'amount'],
          },
        },
        steps: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name', 'ingredients', 'steps'],
    },
  },
  required: ['recipe'],
});
```

## Parameters
- `schema` (JSONSchema7): The JSON schema definition
- `options` (SchemaOptions, optional):
  - `validate`: Optional validation function with signature `(value: unknown) => { success: true; value: OBJECT } | { success: false; error: Error }`. Returns object with `success` boolean and either `value` (if valid) or `error` (if invalid).

## Returns
A JSON schema object compatible with the AI SDK.