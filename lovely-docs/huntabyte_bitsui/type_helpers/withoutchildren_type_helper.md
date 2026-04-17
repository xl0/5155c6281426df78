## WithoutChildren Type Helper

Excludes the `children` snippet prop from a component's type definition. Useful when building custom component wrappers that internally manage the `children` prop.

### Usage

```svelte
import { Accordion, type WithoutChildren } from "bits-ui";

let {
  value,
  onValueChange,
  ...restProps
}: WithoutChildren<Accordion.RootProps> = $props();
```

Apply `WithoutChildren<ComponentProps>` to a component's props type to remove the `children` snippet prop. This ensures exposed props match what's actually used internally, preventing consumers from passing a `children` prop that will be ignored or overridden by the wrapper's internal structure.