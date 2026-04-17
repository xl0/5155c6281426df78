## useId

Utility function to generate unique IDs, used internally by all Bits UI components and exposed for public use.

### Usage

```svelte
import { useId } from "bits-ui";
const id = useId();
```

Apply the generated ID to elements:
```svelte
<label for={id}>Label here</label>
<input {id} />
```

The function returns a unique identifier string suitable for associating form labels with inputs and other elements requiring unique identifiers.