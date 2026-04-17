## WithoutChild Type Helper

Excludes the `child` snippet prop from a component. Useful when building custom component wrappers that populate the `children` prop and don't expose a custom `child` snippet.

### Example

```svelte
<script lang="ts">
  import { Accordion, type WithoutChild } from "bits-ui";
  let { children, ...restProps }: WithoutChild<Accordion.ItemProps> = $props();
</script>
<Accordion.Header {...restProps}>
  <Accordion.Trigger>
    {@render children?.()}
  </Accordion.Trigger>
</Accordion.Header>
```

Use `WithoutChild<ComponentProps>` to type a component that wraps another component and manages its children internally, preventing consumers from passing a custom `child` snippet.