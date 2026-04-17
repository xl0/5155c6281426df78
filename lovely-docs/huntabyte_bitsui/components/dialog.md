# Dialog Component

Modal window for displaying content or requesting user input using a compound component pattern.

## Architecture

Composed of sub-components: `Root` (state management), `Trigger` (toggle button), `Portal` (renders outside DOM), `Overlay` (backdrop), `Content` (main container), `Title`, `Description`, `Close`.

```svelte
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## State Management

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<Dialog.Root bind:open={isOpen}>...</Dialog.Root>
```

**Fully controlled with function binding:**
```svelte
<Dialog.Root bind:open={getOpen, setOpen}>...</Dialog.Root>
```

## Focus Management

- **Focus trap** (default): Keyboard focus stays within dialog. Disable with `trapFocus={false}` on `Dialog.Content`.
- **Open focus**: Automatically focuses first focusable element. Customize with `onOpenAutoFocus`:
```svelte
<Dialog.Content onOpenAutoFocus={(e) => { e.preventDefault(); nameInput?.focus(); }}>
```
- **Close focus**: Returns focus to trigger. Customize with `onCloseAutoFocus`.

## Advanced Behaviors

**Scroll lock** (default enabled): Disable body scrolling when dialog opens. Customize with `preventScroll={false}` on `Dialog.Content`.

**Escape key handling:**
- `escapeKeydownBehavior`: `'close'` (default), `'ignore'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`
- `onEscapeKeydown`: Custom handler with `event.preventDefault()`

**Outside interaction:**
- `interactOutsideBehavior`: `'close'` (default), `'ignore'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`
- `onInteractOutside`: Custom handler with `event.preventDefault()`

## Nested Dialogs

Dialogs can nest within each other. Use data attributes and CSS variables for styling:
- `data-nested-open`: Present when nested dialogs are open
- `data-nested`: Present on nested dialog
- `--bits-dialog-depth`: Nesting depth (0 for root)
- `--bits-dialog-nested-count`: Number of open nested dialogs

```svelte
<Dialog.Content
  style="transform: scale(calc(1 - var(--bits-dialog-nested-count) * 0.05));
         filter: blur(calc(var(--bits-dialog-nested-count) * 2px));"
>
```

## Svelte Transitions

Use `forceMount` with `child` snippet for animations:
```svelte
<Dialog.Overlay forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade>...</div>
    {/if}
  {/snippet}
</Dialog.Overlay>
```

Reusable wrapper:
```svelte
<script>
  import { Dialog } from "bits-ui";
  import { fade } from "svelte/transition";
  let { duration = 200, children, ...restProps } = $props();
</script>
<Dialog.Overlay forceMount {...restProps}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Dialog.Overlay>
```

## Reusable Components

Create custom wrapper:
```svelte
<script>
  import { Dialog } from "bits-ui";
  let { open = $bindable(false), buttonText, title, description, contentProps, children, ...restProps } = $props();
</script>
<Dialog.Root bind:open {...restProps}>
  <Dialog.Trigger>{buttonText}</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content {...contentProps}>
      <Dialog.Title>{@render title()}</Dialog.Title>
      <Dialog.Description>{@render description()}</Dialog.Description>
      {@render children?.()}
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Usage:
```svelte
<MyDialog buttonText="Open">
  {#snippet title()}Account settings{/snippet}
  {#snippet description()}Manage settings{/snippet}
</MyDialog>
```

## Form Submission

Close dialog after async action:
```svelte
<form onsubmit={() => { wait(1000).then(() => (open = false)); }}>
  <button type="submit">Submit</button>
</form>
```

When dialog is *inside* a form, disable `Portal` to keep content in form context.

## API Reference

**Dialog.Root**: `open` (bindable boolean), `onOpenChange`, `onOpenChangeComplete`, `children`

**Dialog.Trigger**: `ref` (bindable HTMLButtonElement), `children`, `child` snippet

**Dialog.Portal**: `to` (Element|string, default body), `disabled` (boolean), `children`

**Dialog.Content**: 
- Focus: `onOpenAutoFocus`, `onCloseAutoFocus`, `trapFocus` (default true)
- Escape: `onEscapeKeydown`, `escapeKeydownBehavior` (default 'close')
- Outside: `onInteractOutside`, `interactOutsideBehavior` (default 'close')
- Scroll: `preventScroll` (default true), `restoreScrollDelay`
- Rendering: `forceMount`, `preventOverflowTextSelection` (default true)
- `ref` (bindable HTMLDivElement), `children`, `child` snippet
- Data attributes: `data-state` ('open'|'closed'), `data-dialog-content`, `data-nested-open`, `data-nested`
- CSS variables: `--bits-dialog-depth`, `--bits-dialog-nested-count`

**Dialog.Overlay**: `forceMount`, `ref` (bindable HTMLDivElement), `children`, `child` snippet, same data attributes and CSS variables as Content

**Dialog.Close**: `ref` (bindable HTMLButtonElement), `children`, `child` snippet

**Dialog.Title**: `level` (1-6, default 3), `ref` (bindable HTMLDivElement), `children`, `child` snippet

**Dialog.Description**: `ref` (bindable HTMLDivElement), `children`, `child` snippet