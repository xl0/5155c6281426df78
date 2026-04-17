Generates a unique identifier string. Optionally accepts a `size` parameter (number) to specify the ID length, defaulting to 16 characters. This is the same ID generator used internally by the AI SDK.

```ts
import { generateId } from 'ai';

const id = generateId();
const customId = generateId(32); // custom length (deprecated parameter)
```

Returns a string representing the generated ID. The `size` parameter is deprecated and will be removed in the next major version.