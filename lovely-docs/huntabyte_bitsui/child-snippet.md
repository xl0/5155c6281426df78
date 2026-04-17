## Child Snippet

The `child` snippet provides complete control over rendered elements in Bits UI components while maintaining accessibility and functionality.

### When to Use
- Need Svelte features (transitions, animations, actions, scoped styles)
- Custom component integration
- Precise DOM structure control
- Advanced component composition

### Basic Usage

Components like `Accordion.Trigger` render default elements (e.g., `<button>`). Override with the `child` snippet:

```svelte
<script lang="ts">
  import MyCustomButton from "$lib/components";
  import { Accordion } from "bits-ui";
</script>

<Accordion.Trigger>
  {#snippet child({ props })}
    <MyCustomButton {...props}>Toggle Item</MyCustomButton>
  {/snippet}
</Accordion.Trigger>

<!-- or with scoped styles -->
<Accordion.Trigger>
  {#snippet child({ props })}
    <button {...props} class="scoped-button">Toggle Item</button>
  {/snippet}
</Accordion.Trigger>

<style>
  .scoped-button {
    background-color: #3182ce;
    color: #fff;
  }
</style>
```

The `props` parameter contains all necessary attributes and event handlers. Spread `{...props}` onto your custom element.

### How It Works

Components supporting `child` snippet:
1. Pass internal props and user props via the `props` snippet parameter
2. You decide which element receives these props
3. Component's internal logic continues working

Internal implementation pattern:
```svelte
<script lang="ts">
  let { child, children, ...restProps } = $props();
  const trigger = makeTrigger();
  const mergedProps = $derived(mergeProps(restProps, trigger.props));
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <button {...mergedProps}>
    {@render children?.()}
  </button>
{/if}
```

### Working with Props

Pass custom IDs, attributes, and event handlers to the component; they merge into `props`:

```svelte
<Accordion.Trigger
  id="my-custom-id"
  data-testid="accordion-trigger"
  onclick={() => console.log("clicked")}
>
  {#snippet child({ props })}
    <button {...props}>Open accordion item</button>
  {/snippet}
</Accordion.Trigger>
```

The `props` object includes custom ID, data attributes, click handler (merged with internal handlers), and all required ARIA attributes.

### Svelte Features Integration

Apply transitions, actions, and scoped styles:

```svelte
<Accordion.Trigger>
  {#snippet child({ props })}
    <div {...props} use:myCustomAction class="my-custom-trigger">
      <!-- ... -->
    </div>
  {/snippet}
</Accordion.Trigger>

<style>
  .my-custom-trigger {
    background-color: #3182ce;
    color: #fff;
  }
</style>
```

### Floating Components

Floating content (tooltips, popovers, dropdowns) requires two-level structure:

```svelte
<Popover.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props}>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

**Rules:**
- Outer wrapper with `{...wrapperProps}` must be unstyled (handles positioning)
- Style the inner content element
- Use `open` parameter for conditional rendering and transitions
- Maintain two-level structure for proper positioning

**Components requiring wrapper:** `Combobox.Content`, `DatePicker.Content`, `DateRangePicker.Content`, `DropdownMenu.Content`, `LinkPreview.Content`, `Menubar.Content`, `Popover.Content`, `Select.Content`, `Tooltip.Content`

### Examples

Basic custom element:
```svelte
<Collapsible.Trigger>
  {#snippet child({ props })}
    <button {...props}>
      <Icon name="star" />
      <span>Favorite</span>
    </button>
  {/snippet}
</Collapsible.Trigger>
```

With Svelte transitions:
```svelte
<Dialog.Content>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:scale={{ start: 0.95 }}>
        Dialog content with a scale transition
      </div>
    {/if}
  {/snippet}
</Dialog.Content>
```

Floating element:
```svelte
<Tooltip.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fade>Custom tooltip content</div>
      </div>
    {/if}
  {/snippet}
</Tooltip.Content>
```

### Common Pitfalls
- Missing `{...props}` spread on custom element
- Styling wrapper element in floating components (breaks positioning)
- Other children outside snippet are ignored when using child
- Forgetting two-level structure for floating elements