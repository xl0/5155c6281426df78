## Overview
Combobox combines an input field with a dropdown list, enabling users to search, filter, and select from predefined options. Supports both single and multiple selection modes.

## Key Features
- Full keyboard navigation with ARIA attributes
- Customizable rendering with grouped items support
- Portal support for complex UI structures
- Floating UI positioning (with opt-out option)

## Architecture
Sub-components:
- **Root**: Main container managing state and context
- **Input**: Search query field
- **Trigger**: Opens dropdown
- **Portal**: Renders content to body or custom target
- **Content**: Dropdown container using Floating UI
- **ContentStatic**: Alternative without Floating UI
- **Viewport**: Visible area for scroll behavior
- **ScrollUpButton/ScrollDownButton**: Scroll controls
- **Item**: Individual selectable item
- **Group/GroupHeading**: Item grouping
- **Arrow**: Pointer element

## Basic Structure
```svelte
<Combobox.Root type="single|multiple">
  <Combobox.Input />
  <Combobox.Trigger />
  <Combobox.Portal>
    <Combobox.Content>
      <Combobox.Group>
        <Combobox.GroupHeading />
        <Combobox.Item />
      </Combobox.Group>
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

## Complete Example
```svelte
<script lang="ts">
  import { Combobox } from "bits-ui";
  import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
  import Check from "phosphor-svelte/lib/Check";
  
  const fruits = [
    { value: "mango", label: "Mango" },
    { value: "apple", label: "Apple" },
  ];
  
  let searchValue = $state("");
  const filteredFruits = $derived(
    searchValue === ""
      ? fruits
      : fruits.filter((f) => f.label.toLowerCase().includes(searchValue.toLowerCase()))
  );
</script>

<Combobox.Root type="multiple" onOpenChangeComplete={(o) => { if (!o) searchValue = ""; }}>
  <div class="relative">
    <Combobox.Input
      oninput={(e) => (searchValue = e.currentTarget.value)}
      placeholder="Search a fruit"
    />
    <Combobox.Trigger>
      <CaretUpDown />
    </Combobox.Trigger>
  </div>
  <Combobox.Portal>
    <Combobox.Content sideOffset={10}>
      <Combobox.ScrollUpButton>↑</Combobox.ScrollUpButton>
      <Combobox.Viewport>
        {#each filteredFruits as fruit}
          <Combobox.Item value={fruit.value} label={fruit.label}>
            {#snippet children({ selected })}
              {fruit.label}
              {#if selected}<Check />{/if}
            {/snippet}
          </Combobox.Item>
        {:else}
          <span>No results found</span>
        {/each}
      </Combobox.Viewport>
      <Combobox.ScrollDownButton>↓</Combobox.ScrollDownButton>
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

## Reusable Component Pattern
```svelte
<script lang="ts">
  import { Combobox, type WithoutChildrenOrChild, mergeProps } from "bits-ui";
  
  type Props = Combobox.RootProps & {
    items?: Array<{ value: string; label: string; disabled?: boolean }>;
    inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
    contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
  };
  
  let { items = [], value = $bindable(), open = $bindable(false), inputProps, contentProps, type, ...restProps }: Props = $props();
  
  let searchValue = $state("");
  const filteredItems = $derived.by(() => {
    if (searchValue === "") return items;
    return items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
  });
  
  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    searchValue = e.currentTarget.value;
  }
  
  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) searchValue = "";
  }
  
  const mergedRootProps = $derived(mergeProps(restProps, { onOpenChange: handleOpenChange }));
  const mergedInputProps = $derived(mergeProps(inputProps, { oninput: handleInput }));
</script>

<Combobox.Root {type} {items} bind:value={value as never} bind:open {...mergedRootProps}>
  <Combobox.Input {...mergedInputProps} />
  <Combobox.Trigger>Open</Combobox.Trigger>
  <Combobox.Portal>
    <Combobox.Content {...contentProps}>
      {#each filteredItems as item}
        <Combobox.Item {...item}>
          {#snippet children({ selected })}
            {item.label}
            {selected ? "✅" : ""}
          {/snippet}
        </Combobox.Item>
      {:else}
        <span>No results found</span>
      {/each}
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

## State Management

### Value Binding
Two-way: `bind:value={myValue}`
Fully controlled: `bind:value={getValue, setValue}`

### Open State
Two-way: `bind:open={myOpen}`
Fully controlled: `bind:open={getOpen, setOpen}`

## Floating UI
By default uses Floating UI for positioning. Opt-out with `Combobox.ContentStatic` and position manually.

## Custom Anchor
Anchor content to different element:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<Combobox.Content {customAnchor}>...</Combobox.Content>
```

## Viewport & Scrolling
`Combobox.Viewport` determines content size for scroll button rendering. Set min/max height on viewport.

Scroll buttons auto-scroll with configurable delay:
```svelte
<Combobox.ScrollUpButton delay={(tick) => 50}>↑</Combobox.ScrollUpButton>
```

For native scrolling, omit scroll buttons and viewport, set height and overflow on Content.

## Scroll Lock
Prevent body scroll when open: `<Combobox.Content preventScroll={true}>`

## Highlighted Items
Follows WAI-ARIA descendant pattern - input retains focus during keyboard navigation, items highlighted as navigated.

Style with `data-highlighted` attribute:
```svelte
<Combobox.Item class="data-highlighted:bg-muted">...</Combobox.Item>
```

Callbacks: `onHighlight` and `onUnhighlight` props on Item.

## Svelte Transitions
Use `forceMount` with `child` snippet for transition control:
```svelte
<Combobox.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>...</div>
      </div>
    {/if}
  {/snippet}
</Combobox.Content>
```

## API Reference

### Combobox.Root
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
- `allowDeselect`: boolean (default: true)
- `items`: Array<{value: string; label: string; disabled?: boolean}>
- `inputValue`: string (read-only, syncs with selection)

### Combobox.Trigger
- `ref` ($bindable): HTMLButtonElement
- Data attributes: `data-state`, `data-disabled`, `data-combobox-trigger`

### Combobox.Input
- `defaultValue`: string
- `clearOnDeselect`: boolean (default: false)
- `ref` ($bindable): HTMLInputElement
- Data attributes: `data-state`, `data-disabled`, `data-combobox-input`

### Combobox.Content
Floating UI positioning options:
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
- CSS variables: `--bits-combobox-content-transform-origin`, `--bits-combobox-content-available-width`, `--bits-combobox-content-available-height`, `--bits-combobox-anchor-width`, `--bits-combobox-anchor-height`
- Data attributes: `data-state`, `data-combobox-content`

### Combobox.ContentStatic
Similar to Content but without Floating UI:
- `onEscapeKeydown`, `escapeKeydownBehavior`, `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`
- `onOpenAutoFocus`, `onCloseAutoFocus`
- `trapFocus`: boolean (default: true)
- `preventScroll`: boolean (default: true)
- `preventOverflowTextSelection`: boolean (default: true)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `loop`: boolean (default: false)
- `forceMount`: boolean (default: false)

### Combobox.Portal
- `to`: Element | string (default: document.body)
- `disabled`: boolean (default: false)

### Combobox.Item
- `value` (required): string
- `label`: string
- `disabled`: boolean (default: false)
- `onHighlight`: callback
- `onUnhighlight`: callback
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-value`, `data-label`, `data-disabled`, `data-highlighted`, `data-selected`, `data-combobox-item`

### Combobox.Viewport
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-combobox-viewport`

### Combobox.ScrollUpButton / ScrollDownButton
- `delay`: (tick: number) => number (default: () => 50)
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-combobox-scroll-up-button` / `data-combobox-scroll-down-button`

### Combobox.Group
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-combobox-group`

### Combobox.GroupHeading
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-combobox-group-heading`

### Combobox.Arrow
- `width`: number (default: 8)
- `height`: number (default: 8)
- `ref` ($bindable): HTMLDivElement
- Data attributes: `data-arrow`