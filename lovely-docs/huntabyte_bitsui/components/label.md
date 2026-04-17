## Label Component

Enhanced label element for associating with form inputs.

### Basic Usage

```svelte
<script lang="ts">
  import { Label } from "bits-ui";
</script>

<Label.Root id="terms-label" for="terms">
  Accept terms and conditions
</Label.Root>
```

### With Checkbox Example

```svelte
<script lang="ts">
  import { Checkbox, Label } from "bits-ui";
  import Check from "phosphor-svelte/lib/Check";
  import Minus from "phosphor-svelte/lib/Minus";
</script>

<div class="flex items-center space-x-3">
  <Checkbox.Root
    id="terms"
    aria-labelledby="terms-label"
    class="border-muted bg-foreground data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border transition-all duration-150 ease-in-out active:scale-[0.98]"
    name="hello"
  >
    {#snippet children({ checked, indeterminate })}
      <div class="text-background inline-flex items-center justify-center">
        {#if indeterminate}
          <Minus class="size-[15px]" weight="bold" />
        {:else if checked}
          <Check class="size-[15px]" weight="bold" />
        {/if}
      </div>
    {/snippet}
  </Checkbox.Root>
  <Label.Root
    id="terms-label"
    for="terms"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    Accept terms and conditions
  </Label.Root>
</div>
```

### API Reference

**Label.Root** - Enhanced label component

| Property | Type | Description |
|----------|------|-------------|
| `ref` $bindable | `HTMLLabelElement` | Bindable reference to the underlying DOM element |
| `children` | `Snippet` | Content to render inside the label |
| `child` | `Snippet<{ props: Record<string, unknown> }>` | Render delegation snippet for custom element rendering (see Child Snippet docs) |

**Data Attributes**

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-label-root` | `''` | Present on the root element |