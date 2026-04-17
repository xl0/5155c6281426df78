## WithElementRef Type Helper

A convenience type that enables the `ref` prop on custom components, following the same pattern used by Bits UI components.

### Type Definition

```ts
type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};
```

Generic parameters:
- `T`: Your component's props type
- `U`: The HTML element type (defaults to `HTMLElement`)

### Usage Example

```ts
import type { WithElementRef } from "bits-ui";

type Props = WithElementRef<
  {
    yourPropA: string;
    yourPropB: number;
  },
  HTMLButtonElement
>;

let { yourPropA, yourPropB, ref = $bindable(null) }: Props = $props();
```

Then bind the ref to your element:
```svelte
<button bind:this={ref}>
  <!-- content -->
</button>
```

This allows consumers of your component to access the underlying HTML element via the `ref` prop.