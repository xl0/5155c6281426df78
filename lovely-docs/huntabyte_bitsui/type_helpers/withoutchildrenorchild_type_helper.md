## WithoutChildrenOrChild Type Helper

A type helper that excludes the `child` and `children` props from a component's type definition.

**Purpose**: Use when building custom component wrappers that internally populate the `children` prop and don't expose it to users.

**Example**:
```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  let {
    title,
    ...restProps
  }: WithoutChildrenOrChild<
    Accordion.TriggerProps & {
      title: string;
    }
  > = $props();
</script>
<Accordion.Trigger>
  {title}
</Accordion.Trigger>
```

The `CustomAccordionTrigger` component exposes all root component props except `children` and `child`. This prevents users from passing conflicting children while still allowing other customization through inherited props.

Related: `child` snippet prop (see delegation documentation), `WithoutChildren` type helper