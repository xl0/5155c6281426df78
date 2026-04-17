## Tooltip Component

Displays supplementary information when users hover over or interact with an element.

### Basic Structure
```svelte
<Tooltip.Provider>
  <Tooltip.Root delayDuration={200}>
    <Tooltip.Trigger>Hover me</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={8}>
        <Tooltip.Arrow />
        Tooltip content here
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

### Provider Component
`Tooltip.Provider` is required as an ancestor. It provides shared state for all tooltips within it. Set `delayDuration` (default 700ms) and `disableHoverableContent` on the provider to apply to all child tooltips. Only one tooltip per provider can be open at once. Recommended to wrap root layout:

```svelte
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
```

### Managing Open State

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<Tooltip.Root bind:open={isOpen}>...</Tooltip.Root>
```

**Fully controlled with function binding:**
```svelte
<script>
  let myOpen = $state(false);
</script>
<Tooltip.Root bind:open={() => myOpen, (v) => (myOpen = v)}>...</Tooltip.Root>
```

### Mobile Tooltips
Tooltips are **not supported on mobile** - there is no hover state. If using tooltip on a button without action, consider using Popover instead. Tooltip content should be non-essential; assume it may never be read.

### Reusable Component Example
```svelte
<!-- MyTooltip.svelte -->
<script lang="ts">
  import { Tooltip } from "bits-ui";
  type Props = Tooltip.RootProps & {
    trigger: Snippet;
    triggerProps?: Tooltip.TriggerProps;
  };
  let { open = $bindable(false), children, trigger, triggerProps = {}, ...restProps } = $props();
</script>
<Tooltip.Root bind:open {...restProps}>
  <Tooltip.Trigger {...triggerProps}>{@render trigger()}</Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>
      <Tooltip.Arrow />
      {@render children?.()}
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
```

Usage:
```svelte
<MyTooltip triggerProps={{ onclick: () => alert("action") }}>
  {#snippet trigger()}
    <BoldIcon />
  {/snippet}
  Change font to bold
</MyTooltip>
```

### Configuration Options

**Delay Duration:** Control hover delay before tooltip appears (default 700ms):
```svelte
<Tooltip.Root delayDuration={200}>...</Tooltip.Root>
```

**Close on Trigger Click:** By default closes when trigger clicked. Disable with:
```svelte
<Tooltip.Root disableCloseOnTriggerClick>...</Tooltip.Root>
```

**Hoverable Content:** By default tooltip stays open when hovering content. Disable with:
```svelte
<Tooltip.Root disableHoverableContent>...</Tooltip.Root>
```

**Non-Keyboard Focus:** Prevent opening on non-keyboard focus:
```svelte
<Tooltip.Root ignoreNonKeyboardFocus>...</Tooltip.Root>
```

### Svelte Transitions
Use `forceMount` with child snippet for Svelte transitions:
```svelte
<Tooltip.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly={{ duration: 300 }}>
          Content
        </div>
      </div>
    {/if}
  {/snippet}
</Tooltip.Content>
```

### Floating UI Opt-out
Use `Tooltip.ContentStatic` instead of `Tooltip.Content` to opt-out of Floating UI positioning. You handle positioning entirely. `Tooltip.Arrow` won't work with `ContentStatic`.

```svelte
<Tooltip.Root>
  <Tooltip.Trigger>Hello</Tooltip.Trigger>
  <Tooltip.ContentStatic>Content</Tooltip.ContentStatic>
</Tooltip.Root>
```

### Custom Anchor
Anchor content to different element instead of trigger:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}>Custom Anchor</div>
<Tooltip.Root>
  <Tooltip.Trigger />
  <Tooltip.Content customAnchor={customAnchor}>...</Tooltip.Content>
</Tooltip.Root>
```

### API Reference

**Tooltip.Provider Props:**
- `delayDuration` (number, default 700): Hover delay in ms
- `disableHoverableContent` (boolean, default false): Disable hoverable content
- `disabled` (boolean, default false): Disable tooltip
- `disableCloseOnTriggerClick` (boolean, default false): Don't close on trigger click
- `skipDelayDuration` (number, default 300): Delay after first hover
- `ignoreNonKeyboardFocus` (boolean, default false): Ignore non-keyboard focus

**Tooltip.Root Props:**
- `open` (boolean, $bindable, default false): Open state
- `onOpenChange` (function): Called when open state changes
- `onOpenChangeComplete` (function): Called after animations complete
- `disabled`, `delayDuration`, `disableHoverableContent`, `disableCloseOnTriggerClick`, `ignoreNonKeyboardFocus`: Same as Provider

**Tooltip.Trigger Props:**
- `disabled` (boolean, default false): Disable trigger
- `ref` (HTMLButtonElement, $bindable): DOM reference
- Data attributes: `data-state` ('delayed-open' | 'instant-open' | 'closed'), `data-tooltip-trigger`

**Tooltip.Content Props:**
- `side` (enum: 'top' | 'bottom' | 'left' | 'right', default 'bottom'): Preferred side
- `sideOffset` (number, default 0): Distance from anchor in px
- `align` (enum: 'start' | 'center' | 'end', default 'start'): Preferred alignment
- `alignOffset` (number, default 0): Alignment offset in px
- `arrowPadding` (number, default 0): Virtual padding around viewport
- `avoidCollisions` (boolean, default true): Prevent collisions
- `collisionBoundary` (Element | null): Boundary to check collisions against
- `collisionPadding` (number | Partial<Record<Side, number>>, default 0): Virtual padding for collisions
- `sticky` ('partial' | 'always', default 'partial'): Sticky behavior on align axis
- `hideWhenDetached` (boolean, default true): Hide when detached from DOM
- `updatePositionStrategy` ('optimized' | 'always', default 'optimized'): Position update strategy
- `strategy` ('fixed' | 'absolute', default 'fixed'): Positioning strategy
- `preventScroll` (boolean, default true): Prevent body scroll when open
- `customAnchor` (string | HTMLElement | Measurable | null, default null): Custom anchor element
- `onInteractOutside` (function): Callback for outside pointer interactions
- `onFocusOutside` (function): Callback for focus leaving
- `interactOutsideBehavior` ('close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore', default 'close'): Outside interaction behavior
- `onEscapeKeydown` (function): Callback for escape key
- `escapeKeydownBehavior` ('close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore', default 'close'): Escape key behavior
- `forceMount` (boolean, default false): Force mount for transitions
- `dir` ('ltr' | 'rtl', default 'ltr'): Reading direction
- `ref` (HTMLDivElement, $bindable): DOM reference
- Data attributes: `data-state`, `data-tooltip-content`
- CSS variables: `--bits-tooltip-content-transform-origin`, `--bits-tooltip-content-available-width`, `--bits-tooltip-content-available-height`, `--bits-tooltip-anchor-width`, `--bits-tooltip-anchor-height`

**Tooltip.ContentStatic Props:**
- Same as Tooltip.Content except no Floating UI positioning props (side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, preventScroll, customAnchor)
- `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`, `onEscapeKeydown`, `escapeKeydownBehavior`, `forceMount`, `dir`, `ref`

**Tooltip.Arrow Props:**
- `width` (number, default 8): Arrow width in px
- `height` (number, default 8): Arrow height in px
- `ref` (HTMLDivElement, $bindable): DOM reference
- Data attributes: `data-arrow`, `data-tooltip-arrow`, `data-side` ('top' | 'right' | 'bottom' | 'left')

**Tooltip.Portal Props:**
- `to` (Element | string, default document.body): Where to render content
- `disabled` (boolean, default false): Disable portal rendering