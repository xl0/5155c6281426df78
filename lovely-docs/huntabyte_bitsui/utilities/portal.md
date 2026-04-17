## Portal Component

Utility component that renders children in a portal, preventing layout issues in complex UI structures.

### Default Behavior
By default, Portal renders children to the `body` element:
```svelte
<script lang="ts">
  import { Portal } from "bits-ui";
</script>
<Portal>
  <div>This content will be portalled to the body</div>
</Portal>
```

### Custom Target
Use the `to` prop to specify a custom target element or selector:
```svelte
<Portal to="#custom-target">
  <div>This content will be portalled to the #custom-target element</div>
</Portal>
```

### Disable Portal Behavior
Use the `disabled` prop to prevent portalling:
```svelte
<Portal disabled>
  <div>This content will not be portalled</div>
</Portal>
```

### Override Default Target
Use `BitsConfig` component's `defaultPortalTo` prop to change the default target for all Portal components in scope:
```svelte
<script lang="ts">
  import { Portal, BitsConfig } from "bits-ui";
  let target: HTMLElement | undefined = $state();
</script>
<BitsConfig defaultPortalTo={target}>
  <div bind:this={target} class="bg-background flex rounded-md border p-2">
    <section class="flex size-12 items-center justify-center bg-blue-200">
      <Portal>
        <div class="size-12 bg-blue-600"></div>
      </Portal>
    </section>
  </div>
</BitsConfig>
```

### API Reference

**Portal** - Renders children to a different DOM location.

| Property   | Type                 | Description |
| ---------- | -------------------- | ----------- |
| `to`       | Element \| string    | Where to render content. Defaults to `document.body` |
| `disabled` | boolean              | When true, renders content in original DOM location. Default: `false` |
| `children` | Snippet              | Content to render |