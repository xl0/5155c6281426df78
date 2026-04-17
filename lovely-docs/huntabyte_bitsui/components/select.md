## Select Component

Dropdown component for selecting from a list of options with typeahead search, keyboard navigation, and customizable grouping.

### Key Features
- Typeahead search for quick option finding
- Full keyboard navigation (arrow keys, enter to select)
- Grouped options support
- Scroll management with up/down buttons
- ARIA attributes and screen reader support
- Portal rendering to prevent layout issues

### Architecture

Sub-components:
- **Root**: Main container managing state and context
- **Trigger**: Button that opens the dropdown
- **Portal**: Renders dropdown content to body or custom target
- **Content**: Dropdown container using Floating UI for positioning
- **ContentStatic**: Alternative without Floating UI (manual positioning)
- **Viewport**: Visible area determining size and scroll behavior
- **ScrollUpButton/ScrollDownButton**: Scroll controls for large lists
- **Item**: Individual selectable item
- **Group/GroupHeading**: Organize related items
- **Arrow**: Optional pointer to trigger

### Basic Structure
```svelte
<Select.Root type="single" bind:value>
  <Select.Trigger>Select option</Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.ScrollUpButton />
      <Select.Viewport>
        <Select.Item value="a" label="Option A" />
      </Select.Viewport>
      <Select.ScrollDownButton />
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let value = $state("");
</script>
<Select.Root type="single" bind:value>...</Select.Root>
```

**Fully controlled with function binding:**
```svelte
<script>
  let value = $state("");
  function getValue() { return value; }
  function setValue(v) { value = v; }
</script>
<Select.Root type="single" bind:value={getValue, setValue}>...</Select.Root>
```

**Open state:**
```svelte
<script>
  let open = $state(false);
</script>
<Select.Root bind:open>...</Select.Root>
```

### Multiple Selection
```svelte
<script>
  let value = $state<string[]>([]);
</script>
<Select.Root type="multiple" bind:value>
  <Select.Trigger>
    {value.length ? value.join(", ") : "Select items"}
  </Select.Trigger>
  <!-- ... -->
</Select.Root>
```

### Reusable Component Pattern
```svelte
<!-- MySelect.svelte -->
<script lang="ts">
  import { Select, type WithoutChildren } from "bits-ui";
  type Props = WithoutChildren<Select.RootProps> & {
    placeholder?: string;
    items: { value: string; label: string; disabled?: boolean }[];
  };
  let { value = $bindable(), items, placeholder, ...rest }: Props = $props();
  const selectedLabel = $derived(items.find(i => i.value === value)?.label);
</script>
<Select.Root bind:value={value as never} {...rest}>
  <Select.Trigger>{selectedLabel ?? placeholder}</Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.ScrollUpButton>up</Select.ScrollUpButton>
      <Select.Viewport>
        {#each items as { value, label, disabled }}
          <Select.Item {value} {label} {disabled}>
            {#snippet children({ selected })}
              {selected ? "✅" : ""} {label}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
      <Select.ScrollDownButton>down</Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

Usage:
```svelte
<script>
  import MySelect from "$lib/components/MySelect.svelte";
  let fruit = $state("apple");
  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ];
</script>
<MySelect {items} bind:value={fruit} />
```

### Floating UI Positioning

By default, `Select.Content` uses Floating UI to position relative to trigger. Opt-out with `Select.ContentStatic` for manual positioning:
```svelte
<Select.Root>
  <Select.Trigger />
  <Select.Portal>
    <Select.ContentStatic>
      <!-- position yourself -->
    </Select.ContentStatic>
  </Select.Portal>
</Select.Root>
```

### Custom Anchor
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<Select.Root>
  <Select.Trigger />
  <Select.Content {customAnchor}>...</Select.Content>
</Select.Root>
```

### Viewport & Scrolling

`Select.Viewport` determines content size for scroll button visibility. Set min/max height on viewport:
```svelte
<Select.Viewport class="max-h-96">...</Select.Viewport>
```

Scroll buttons auto-hide when content fits. Custom scroll delay with `delay` prop:
```svelte
<script>
  import { cubicOut } from "svelte/easing";
  function autoScrollDelay(tick: number) {
    const maxDelay = 200, minDelay = 25, steps = 30;
    const progress = Math.min(tick / steps, 1);
    return maxDelay - (maxDelay - minDelay) * cubicOut(progress);
  }
</script>
<Select.ScrollUpButton delay={autoScrollDelay} />
```

For native scrollbar instead of buttons, omit scroll buttons and set height/overflow on Content:
```svelte
<Select.Content class="max-h-96 overflow-y-auto">
  <Select.Viewport><!-- no scroll buttons --></Select.Viewport>
</Select.Content>
```

### Scroll Lock
Prevent body scroll when select open:
```svelte
<Select.Content preventScroll={true}>...</Select.Content>
```

### Highlighted Items

Follows WAI-ARIA descendant pattern: trigger retains focus during keyboard navigation, items highlight as user navigates.

Style highlighted items with `data-highlighted`:
```svelte
<Select.Item class="data-highlighted:bg-blue-100">...</Select.Item>
```

Callbacks:
```svelte
<Select.Item 
  onHighlight={() => console.log('highlighted')}
  onUnhighlight={() => console.log('unhighlighted')}
/>
```

### Svelte Transitions

Use `forceMount` with `child` snippet for transition control:
```svelte
<script>
  import { fly } from "svelte/transition";
</script>
<Select.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly={{ duration: 300 }}>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Select.Content>
```

### API Reference

**Select.Root**
- `type` (required): 'single' | 'multiple'
- `value` ($bindable): string | string[]
- `onValueChange`: callback on value change
- `open` ($bindable): boolean
- `onOpenChange`: callback on open change
- `onOpenChangeComplete`: callback after animations complete
- `disabled`: boolean
- `name`: string (for form submission)
- `required`: boolean
- `scrollAlignment`: 'nearest' | 'center' (default: 'nearest')
- `loop`: boolean (default: false)
- `allowDeselect`: boolean (default: false)
- `items`: { value: string; label: string; disabled?: boolean }[]
- `autocomplete`: string

**Select.Trigger**
- `ref` ($bindable): HTMLButtonElement
- Data attributes: `data-state`, `data-placeholder`, `data-disabled`, `data-select-trigger`

**Select.Content**
- `side`: 'top' | 'bottom' | 'left' | 'right' (default: 'bottom')
- `sideOffset`: number (default: 0)
- `align`: 'start' | 'center' | 'end' (default: 'start')
- `alignOffset`: number (default: 0)
- `avoidCollisions`: boolean (default: true)
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>> (default: 0)
- `sticky`: 'partial' | 'always' (default: 'partial')
- `hideWhenDetached`: boolean (default: true)
- `updatePositionStrategy`: 'optimized' | 'always' (default: 'optimized')
- `strategy`: 'fixed' | 'absolute' (default: 'fixed')
- `preventScroll`: boolean (default: false)
- `customAnchor`: string | HTMLElement | Measurable | null
- `onEscapeKeydown`: callback
- `escapeKeydownBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `onInteractOutside`: callback
- `onFocusOutside`: callback
- `interactOutsideBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `preventOverflowTextSelection`: boolean (default: true)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `loop`: boolean (default: false)
- `forceMount`: boolean (default: false)
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-state`, `data-select-content`
- CSS variables: `--bits-select-content-transform-origin`, `--bits-select-content-available-width`, `--bits-select-content-available-height`, `--bits-select-anchor-width`, `--bits-select-anchor-height`

**Select.ContentStatic** (no Floating UI)
- Similar to Content but without positioning props
- `onEscapeKeydown`, `escapeKeydownBehavior`, `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`
- `onOpenAutoFocus`, `onCloseAutoFocus`
- `trapFocus`: boolean (default: true)
- `preventScroll`: boolean (default: true)
- `preventOverflowTextSelection`: boolean (default: true)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `loop`: boolean (default: false)
- `forceMount`: boolean (default: false)

**Select.Portal**
- `to`: Element | string (default: document.body)
- `disabled`: boolean (default: false)

**Select.Item**
- `value` (required): string
- `label`: string
- `disabled`: boolean (default: false)
- `onHighlight`: callback
- `onUnhighlight`: callback
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-value`, `data-label`, `data-disabled`, `data-highlighted`, `data-selected`, `data-select-item`

**Select.Viewport**
- `ref` ($bindable): HTMLDivElement
- Data attribute: `data-select-viewport`

**Select.ScrollUpButton / Select.ScrollDownButton**
- `delay`: (tick: number) => number (default: () => 50)
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-select-scroll-up-button` / `data-select-scroll-down-button`

**Select.Group**
- `ref` ($bindable): HTMLDivElement
- Data attribute: `data-select-group`

**Select.GroupHeading**
- `ref` ($bindable): HTMLDivElement
- Data attribute: `data-select-group-heading`

**Select.Arrow**
- `width`: number (default: 8)
- `height`: number (default: 8)
- `ref` ($bindable): HTMLDivElement
- Data attribute: `data-arrow`