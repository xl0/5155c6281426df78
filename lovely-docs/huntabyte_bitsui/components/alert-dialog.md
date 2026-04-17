## Alert Dialog

Modal window for presenting content or seeking user input without navigation. Built from compound sub-components.

### Structure
- **Root**: Manages state and context
- **Trigger**: Opens/closes dialog
- **Portal**: Renders outside DOM hierarchy
- **Overlay**: Backdrop behind dialog
- **Content**: Main dialog content
- **Title**: Dialog title
- **Description**: Additional context
- **Cancel**: Closes without action
- **Action**: Confirms action

### Basic Usage
```svelte
<script lang="ts">
  import { AlertDialog } from "bits-ui";
</script>
<AlertDialog.Root>
  <AlertDialog.Trigger>Open Dialog</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Confirm Action</AlertDialog.Title>
      <AlertDialog.Description>Are you sure?</AlertDialog.Description>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

### Reusable Component Pattern
```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import { AlertDialog, type WithoutChild } from "bits-ui";
  type Props = AlertDialog.RootProps & {
    buttonText: string;
    title: Snippet;
    description: Snippet;
    contentProps?: WithoutChild<AlertDialog.ContentProps>;
  };
  let { open = $bindable(false), children, buttonText, contentProps, title, description, ...restProps }: Props = $props();
</script>
<AlertDialog.Root bind:open {...restProps}>
  <AlertDialog.Trigger>{buttonText}</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content {...contentProps}>
      <AlertDialog.Title>{@render title()}</AlertDialog.Title>
      <AlertDialog.Description>{@render description()}</AlertDialog.Description>
      {@render children?.()}
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

Usage:
```svelte
<MyAlertDialog buttonText="Open Dialog">
  {#snippet title()}Delete your account{/snippet}
  {#snippet description()}This action cannot be undone.{/snippet}
</MyAlertDialog>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open Dialog</button>
<AlertDialog.Root bind:open={isOpen}><!-- ... --></AlertDialog.Root>
```

**Fully controlled (function binding):**
```svelte
<script lang="ts">
  let myOpen = $state(false);
  function getOpen() { return myOpen; }
  function setOpen(newOpen: boolean) { myOpen = newOpen; }
</script>
<AlertDialog.Root bind:open={getOpen, setOpen}><!-- ... --></AlertDialog.Root>
```

### Focus Management

**Focus trap** (enabled by default):
```svelte
<AlertDialog.Content trapFocus={false}><!-- ... --></AlertDialog.Content>
```

**Open auto-focus** (defaults to Content):
```svelte
<script lang="ts">
  let nameInput = $state<HTMLInputElement>();
</script>
<AlertDialog.Content onOpenAutoFocus={(e) => { e.preventDefault(); nameInput?.focus(); }}>
  <input type="text" bind:this={nameInput} />
</AlertDialog.Content>
```

**Close auto-focus** (defaults to trigger):
```svelte
<input type="text" bind:this={nameInput} />
<AlertDialog.Root>
  <AlertDialog.Trigger>Open</AlertDialog.Trigger>
  <AlertDialog.Content onCloseAutoFocus={(e) => { e.preventDefault(); nameInput?.focus(); }}>
    <!-- ... -->
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Advanced Behaviors

**Scroll lock** (enabled by default):
```svelte
<AlertDialog.Content preventScroll={false}><!-- ... --></AlertDialog.Content>
```

**Escape key handling:**
- `escapeKeydownBehavior`: `'close'` (default), `'ignore'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`
- `onEscapeKeydown`: Custom callback

```svelte
<AlertDialog.Content escapeKeydownBehavior="ignore"><!-- ... --></AlertDialog.Content>
<AlertDialog.Content onEscapeKeydown={(e) => { e.preventDefault(); /* custom logic */ }}><!-- ... --></AlertDialog.Content>
```

**Outside interaction handling:**
- `interactOutsideBehavior`: `'ignore'` (default), `'close'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`
- `onInteractOutside`: Custom callback

```svelte
<AlertDialog.Content interactOutsideBehavior="close"><!-- ... --></AlertDialog.Content>
<AlertDialog.Content onInteractOutside={(e) => { e.preventDefault(); /* custom logic */ }}><!-- ... --></AlertDialog.Content>
```

### Nested Dialogs

Data attributes for styling:
- `data-nested-open`: Present when nested dialogs are open
- `data-nested`: Present on nested dialog itself

CSS variables:
- `--bits-dialog-depth`: Nesting depth (0 for root, 1 for first nested, etc.)
- `--bits-dialog-nested-count`: Number of open nested dialogs

```svelte
<AlertDialog.Content style="transform: scale(calc(1 - var(--dialog-nested-count) * 0.05));">
  <!-- Alert dialog content -->
</AlertDialog.Content>
```

### Form Submission

```svelte
<script lang="ts">
  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  let open = $state(false);
</script>
<AlertDialog.Root bind:open>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Confirm your action</AlertDialog.Title>
      <AlertDialog.Description>Are you sure?</AlertDialog.Description>
      <form method="POST" action="?/someAction" onsubmit={() => { wait(1000).then(() => (open = false)); }}>
        <AlertDialog.Cancel type="button">No, cancel</AlertDialog.Cancel>
        <AlertDialog.Action type="submit">Yes, submit</AlertDialog.Action>
      </form>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

**Note:** If using AlertDialog within a form, disable Portal to keep content inside form element.

### Key Features
- Compound component structure for flexibility
- ARIA-compliant with keyboard navigation
- Portal support for proper stacking
- Managed focus with customization
- Controlled and uncontrolled state support
- Scroll locking, escape key handling, outside interaction customization
- Nested dialog support with depth tracking

### API Reference

**AlertDialog.Root**
- `open` ($bindable): boolean, default false
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void
- `children`: Snippet

**AlertDialog.Trigger**
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-state` ('open'|'closed'), `data-alert-dialog-trigger`

**AlertDialog.Content**
- `onInteractOutside`: (event: PointerEvent) => void
- `onFocusOutside`: (event: FocusEvent) => void
- `interactOutsideBehavior`: 'close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore', default 'close'
- `onEscapeKeydown`: (event: KeyboardEvent) => void
- `escapeKeydownBehavior`: 'close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore', default 'close'
- `onOpenAutoFocus`: (event: Event) => void
- `onCloseAutoFocus`: (event: Event) => void
- `trapFocus`: boolean, default true
- `forceMount`: boolean, default false
- `preventOverflowTextSelection`: boolean, default true
- `preventScroll`: boolean, default true
- `restoreScrollDelay`: number, default 0
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props and open state
- Data: `data-state`, `data-alert-dialog-content`, `data-nested-open`, `data-nested`
- CSS: `--bits-dialog-depth`, `--bits-dialog-nested-count`

**AlertDialog.Overlay**
- `forceMount`: boolean, default false
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props and open state
- Data: `data-state`, `data-alert-dialog-overlay`, `data-nested-open`, `data-nested`
- CSS: `--bits-dialog-depth`, `--bits-dialog-nested-count`

**AlertDialog.Portal**
- `to`: Element|string, default document.body
- `disabled`: boolean, default false
- `children`: Snippet

**AlertDialog.Action**
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-alert-dialog-action`
- Note: Does not close dialog by default

**AlertDialog.Cancel**
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-alert-dialog-cancel`

**AlertDialog.Title**
- `level`: 1|2|3|4|5|6, default 3 (sets aria-level)
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-alert-dialog-title`

**AlertDialog.Description**
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props
- Data: `data-alert-dialog-description`
