## valibotSchema()

Experimental helper function that converts Valibot schemas into JSON schema objects compatible with the AI SDK.

**Purpose**: Use Valibot schemas for structured data generation and tool definitions in the AI SDK.

**Usage**:
```ts
import { valibotSchema } from '@ai-sdk/valibot';
import { object, string, array } from 'valibot';

const recipeSchema = valibotSchema(
  object({
    name: string(),
    ingredients: array(
      object({
        name: string(),
        amount: string(),
      }),
    ),
    steps: array(string()),
  }),
);
```

**API**:
- **Parameter**: `valibotSchema` (GenericSchema<unknown, T>) - The Valibot schema definition
- **Returns**: A Schema object compatible with the AI SDK containing JSON schema representation and validation functionality

**Applications**: Structured data generation and tool calling