## Ref Prop for DOM Access

The `ref` prop provides direct access to underlying HTML elements in Bits UI components for DOM manipulation like focusing inputs or measuring dimensions.

### Basic Usage

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  let triggerRef = $state<HTMLButtonElement | null>(null);
  function focusTrigger() {
    triggerRef?.focus();
  }
</script>
<button onclick={focusTrigger}>Focus trigger</button>
<Accordion.Trigger bind:ref={triggerRef}>Trigger content</Accordion.Trigger>
```

### With Child Snippet

Bits UI uses element IDs to track references. The `ref` binding works automatically with delegated child elements/components.

```svelte
<script lang="ts">
  import CustomButton from "./CustomButton.svelte";
  import { Accordion } from "bits-ui";
  let triggerRef = $state<HTMLButtonElement | null>(null);
</script>
<Accordion.Trigger bind:ref={triggerRef}>
  {#snippet child({ props })}
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

When using custom IDs, pass them to the parent component first:

```svelte
<Accordion.Trigger bind:ref={triggerRef} id="my-custom-id">
  {#snippet child({ props })}
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

**Pitfall**: Don't set `id` directly on the child element—set it on the parent component instead, otherwise the ref binding breaks.

### Null Behavior

The `ref` value may be `null` until the component mounts in the DOM, consistent with native DOM methods like `getElementById`.

### Creating Custom Ref Props

Use the `WithElementRef` type helper to implement the same pattern in custom components:

```svelte
<script lang="ts">
  import { WithElementRef } from "bits-ui";
  import type { HTMLButtonAttributes } from "svelte/elements";
  let {
    ref = $bindable(null),
    children,
    ...rest
  }: WithElementRef<
    HTMLButtonAttributes & {
      yourPropA: string;
      yourPropB: number;
    },
    HTMLButtonElement
  > = $props();
</script>
<button bind:this={ref} {...rest}>
  {@render children?.()}
</button>
```