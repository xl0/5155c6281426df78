## Purpose
`zodSchema()` converts Zod schemas into JSON schema objects compatible with the AI SDK. Use it for structured data generation and tool definitions, or pass Zod objects directly (the SDK converts them internally).

## Key Points
- Zod objects can be passed directly to AI SDK functions; `zodSchema()` is needed only when you want to specify options like `useReferences`
- **Critical**: When using `.meta()` or `.describe()` on Zod schemas, these methods must be called **last** in the chain, as most schema methods (`.min()`, `.optional()`, `.extend()`, etc.) return new instances that don't inherit metadata

## API
```ts
import { zodSchema } from 'ai';

zodSchema(zodSchema: z.Schema, options?: { useReferences?: boolean })
```

**Parameters:**
- `zodSchema`: The Zod schema definition
- `options.useReferences` (optional, boolean): Enables support for references in schemas. Required for recursive schemas using `z.lazy()`. Not all language models/providers support references. Defaults to `false`.

**Returns:** A Schema object compatible with the AI SDK with JSON schema representation and validation.

## Examples

Metadata placement (correct vs incorrect):
```ts
// ❌ Wrong - .min() returns new instance without metadata
z.string().meta({ describe: 'first name' }).min(1);

// ✅ Correct - .meta() is final
z.string().min(1).meta({ describe: 'first name' });
```

Recursive schema with `useReferences`:
```ts
const baseCategorySchema = z.object({ name: z.string() });

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

const mySchema = zodSchema(
  z.object({ category: categorySchema }),
  { useReferences: true }
);
```