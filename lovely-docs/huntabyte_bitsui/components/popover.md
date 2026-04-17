## Popover Component

Displays rich content in a floating panel anchored to a trigger element.

### Basic Structure
```svelte
<Popover.Root>
  <Popover.Trigger />
  <Popover.Portal>
    <Popover.Overlay />
    <Popover.Content>
      <Popover.Close />
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<Popover.Root bind:open={isOpen}>
```

**Fully controlled with function binding:**
```svelte
<script>
  let myOpen = $state(false);
</script>
<Popover.Root bind:open={() => myOpen, (v) => (myOpen = v)}>
```

### Focus Management

**Trap focus** (default enabled): Set `trapFocus={false}` on `Popover.Content` to disable.

**Open auto-focus** (default focuses first focusable element):
```svelte
<Popover.Content onOpenAutoFocus={(e) => {
  e.preventDefault();
  nameInput?.focus();
}}>
```

**Close auto-focus** (default focuses trigger):
```svelte
<Popover.Content onCloseAutoFocus={(e) => {
  e.preventDefault();
  nameInput?.focus();
}}>
```

### Scroll Lock

Prevent body scroll when popover is open:
```svelte
<Popover.Content preventScroll={true}>
```

### Escape Key Behavior

**Ignore escape:**
```svelte
<Popover.Content escapeKeydownBehavior="ignore">
```

**Custom escape handling:**
```svelte
<Popover.Content onEscapeKeydown={(e) => e.preventDefault()}>
```

### Interact Outside Behavior

**Ignore outside interactions:**
```svelte
<Popover.Content interactOutsideBehavior="ignore">
```

**Custom outside handling:**
```svelte
<Popover.Content onInteractOutside={(e) => e.preventDefault()}>
```

### Custom Anchor

Anchor content to element other than trigger:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<Popover.Root>
  <Popover.Trigger />
  <Popover.Content {customAnchor}>
```

### Svelte Transitions

Use `forceMount` with `child` snippet for animation control:
```svelte
<Popover.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly={{ duration: 300 }}>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

### Overlay Component

Optional overlay behind popover:
```svelte
<Popover.Portal>
  <Popover.Overlay class="fixed inset-0 z-50 bg-black/80" />
  <Popover.Content>
```

### API Reference

**Popover.Root**
- `open` (bindable): boolean, default false
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void

**Popover.Trigger**
- `ref` (bindable): HTMLButtonElement
- Data attributes: `data-state` ('open'|'closed'), `data-popover-trigger`

**Popover.Content**
- `side`: 'top'|'bottom'|'left'|'right', default 'bottom'
- `sideOffset`: number, default 0
- `align`: 'start'|'center'|'end', default 'start'
- `alignOffset`: number, default 0
- `arrowPadding`: number, default 0
- `avoidCollisions`: boolean, default true
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>>, default 0
- `sticky`: 'partial'|'always', default 'partial'
- `hideWhenDetached`: boolean, default true
- `updatePositionStrategy`: 'optimized'|'always', default 'optimized'
- `strategy`: 'fixed'|'absolute', default 'fixed'
- `preventScroll`: boolean, default false
- `customAnchor`: string | HTMLElement | Measurable | null, default null
- `onInteractOutside`: (event: PointerEvent) => void
- `onFocusOutside`: (event: FocusEvent) => void
- `interactOutsideBehavior`: 'close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore', default 'close'
- `onEscapeKeydown`: (event: KeyboardEvent) => void
- `escapeKeydownBehavior`: 'close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore', default 'close'
- `onOpenAutoFocus`: (event: Event) => void
- `onCloseAutoFocus`: (event: Event) => void
- `trapFocus`: boolean, default true
- `preventOverflowTextSelection`: boolean, default true
- `forceMount`: boolean, default false
- `dir`: 'ltr'|'rtl', default 'ltr'
- `ref` (bindable): HTMLDivElement
- CSS variables: `--bits-popover-content-transform-origin`, `--bits-popover-content-available-width`, `--bits-popover-content-available-height`, `--bits-popover-anchor-width`, `--bits-popover-anchor-height`
- Data attributes: `data-state`, `data-popover-content`

**Popover.ContentStatic** (no floating UI)
- Same as Popover.Content except: no positioning props (side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, customAnchor)

**Popover.Overlay**
- `forceMount`: boolean, default false
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-popover-overlay`, `data-state`

**Popover.Close**
- `ref` (bindable): HTMLButtonElement
- Data attribute: `data-popover-close`

**Popover.Arrow**
- `width`: number, default 8
- `height`: number, default 8
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-arrow`, `data-popover-arrow`

**Popover.Portal**
- `to`: Element | string, default document.body
- `disabled`: boolean, default false