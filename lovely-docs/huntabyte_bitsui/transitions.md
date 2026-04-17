## Using Transitions with Components

Svelte transitions (in:, out:, transition:) don't work directly on components. Bits UI v5 removed the old workaround of exposing transition* props and instead provides `forceMount` prop and `child` snippet for flexible animation support.

### Default Behavior
Components handle mounting/unmounting automatically with transition support. CSS transitions and animations work out of the box (examples use tailwindcss-animate).

### Force Mounting Pattern
Use `forceMount` prop to keep component mounted in DOM, then use the `child` snippet to conditionally render and apply transitions:

```svelte
<Dialog.Root>
  <Dialog.Content forceMount>
    {#snippet child({ props, open })}
      {#if open}
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      {/if}
    {/snippet}
  </Dialog.Content>
</Dialog.Root>
```

For reusability, wrap this pattern in a custom component:

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";
  import { Dialog, type WithoutChildrenOrChild } from "bits-ui";
  let {
    ref = $bindable(null),
    children,
    ...restProps
  }: WithoutChildrenOrChild<Dialog.ContentProps> & {
    children?: Snippet;
  } = $props();
</script>
<Dialog.Content bind:ref {...restProps} forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fly>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Dialog.Content>
```

Then use it with other Dialog components normally.

### Floating Content Components
For components using Floating UI (like Popover.Content), add a wrapper element and spread `wrapperProps`:

```svelte
<Popover.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```