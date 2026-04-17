## LinkPreview Component

A component that displays a summarized preview of linked content on hover/focus without navigating away. Only works with mouse/pointing devices; on touch devices the link is followed immediately. Preview content should not contain vital information since it's not accessible to all users.

### Structure
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.Content />
</LinkPreview.Root>
```

### Basic Example
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger href="https://x.com/huntabyte" target="_blank" rel="noreferrer noopener">
    <Avatar.Root>
      <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
      <Avatar.Fallback>HB</Avatar.Fallback>
    </Avatar.Root>
  </LinkPreview.Trigger>
  <LinkPreview.Content sideOffset={8}>
    <div class="flex space-x-4">
      <Avatar.Root>
        <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
        <Avatar.Fallback>HB</Avatar.Fallback>
      </Avatar.Root>
      <div class="space-y-1 text-sm">
        <h4>@huntabyte</h4>
        <p>I do things on the internet.</p>
        <div class="flex items-center gap-[21px] pt-2 text-xs">
          <div><MapPin class="mr-1 size-4" /> FL, USA</div>
          <div><CalendarBlank class="mr-1 size-4" /> Joined May 2020</div>
        </div>
      </div>
    </div>
  </LinkPreview.Content>
</LinkPreview.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open Link Preview</button>
<LinkPreview.Root bind:open={isOpen}>
  <!-- ... -->
</LinkPreview.Root>
```

**Fully controlled with function binding:**
```svelte
<script>
  let myOpen = $state(false);
  function getOpen() { return myOpen; }
  function setOpen(newOpen: boolean) { myOpen = newOpen; }
</script>
<LinkPreview.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</LinkPreview.Root>
```

### Floating UI

By default, `LinkPreview.Content` uses Floating UI for positioning. To opt-out, use `LinkPreview.ContentStatic` instead:
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.ContentStatic>
    <!-- ... -->
  </LinkPreview.ContentStatic>
</LinkPreview.Root>
```

Note: `LinkPreview.Arrow` is designed for Floating UI and may behave unexpectedly with `ContentStatic`.

### Custom Anchor

Anchor content to a different element instead of the trigger:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.Content {customAnchor}>
    <!-- ... -->
  </LinkPreview.Content>
</LinkPreview.Root>
```

### Svelte Transitions

Use `forceMount` with the `child` snippet to enable transitions:
```svelte
<LinkPreview.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly={{ duration: 300 }}>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</LinkPreview.Content>
```

### API Reference

**LinkPreview.Root**
- `open` (bindable): boolean, default false
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void
- `openDelay`: number, default 700ms
- `closeDelay`: number, default 300ms
- `disabled`: boolean, default false
- `ignoreNonKeyboardFocus`: boolean, default false

**LinkPreview.Trigger**
- `ref` (bindable): HTMLAnchorElement
- `children`: Snippet
- `child`: Snippet with props
- Data attributes: `data-state` ('open' | 'closed'), `data-link-preview-trigger`

**LinkPreview.Content** (with Floating UI)
- `side`: 'top' | 'bottom' | 'left' | 'right', default 'bottom'
- `sideOffset`: number, default 0
- `align`: 'start' | 'center' | 'end', default 'start'
- `alignOffset`: number, default 0
- `arrowPadding`: number, default 0
- `avoidCollisions`: boolean, default true
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>>, default 0
- `sticky`: 'partial' | 'always', default 'partial'
- `hideWhenDetached`: boolean, default true
- `updatePositionStrategy`: 'optimized' | 'always', default 'optimized'
- `strategy`: 'fixed' | 'absolute', default 'fixed'
- `preventScroll`: boolean, default true
- `customAnchor`: string | HTMLElement | Measurable | null, default null
- `onInteractOutside`: (event: PointerEvent) => void
- `onFocusOutside`: (event: FocusEvent) => void
- `interactOutsideBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore', default 'close'
- `onEscapeKeydown`: (event: KeyboardEvent) => void
- `escapeKeydownBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore', default 'close'
- `onOpenAutoFocus`: (event: Event) => void
- `onCloseAutoFocus`: (event: Event) => void
- `trapFocus`: boolean, default true
- `dir`: 'ltr' | 'rtl', default 'ltr'
- `forceMount`: boolean, default false
- `ref` (bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props
- Data attributes: `data-state` ('open' | 'closed'), `data-link-preview-content`
- CSS variables: `--bits-link-preview-content-transform-origin`, `--bits-link-preview-content-available-width`, `--bits-link-preview-content-available-height`, `--bits-link-preview-anchor-width`, `--bits-link-preview-anchor-height`

**LinkPreview.ContentStatic** (without Floating UI)
- `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`, `onEscapeKeydown`, `escapeKeydownBehavior`, `onOpenAutoFocus`, `onCloseAutoFocus`, `trapFocus`, `dir`, `forceMount`, `ref`, `children`, `child`
- Data attributes: `data-state`, `data-link-preview-content`

**LinkPreview.Arrow**
- `width`: number, default 8
- `height`: number, default 8
- `ref` (bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props
- Data attribute: `data-link-preview-arrow`

**LinkPreview.Portal**
- `to`: Element | string, default document.body
- `disabled`: boolean, default false
- `children`: Snippet