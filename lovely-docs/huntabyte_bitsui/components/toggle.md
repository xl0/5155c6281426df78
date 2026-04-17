## Toggle Component

A button control that switches between two states (pressed/unpressed).

### Basic Usage

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
</script>
<Toggle.Root />
```

### Managing Pressed State

**Two-way binding:**
```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let myPressed = $state(true);
</script>
<button onclick={() => (myPressed = false)}>un-press</button>
<Toggle.Root bind:pressed={myPressed} />
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let myPressed = $state(false);
</script>
<Toggle.Root bind:pressed={() => myPressed, (newPressed) => (myPressed = newPressed)}>
  <!-- ... -->
</Toggle.Root>
```

### API Reference

**Toggle.Root properties:**
- `pressed` (bindable, boolean, default: false) - Whether the toggle is pressed
- `onPressedChange` (function) - Callback when pressed state changes
- `disabled` (boolean, default: false) - Disables the toggle
- `ref` (bindable, HTMLButtonElement) - Reference to underlying DOM element
- `children` (Snippet) - Content to render
- `child` (Snippet) - For render delegation

**Data attributes:**
- `data-state` - 'on' or 'off'
- `data-disabled` - Present when disabled
- `data-toggle-root` - Present on root element

### Example

Lock/unlock code display toggle:
```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";
  let unlocked = $state(false);
  const code = $derived(unlocked ? "B1T5" : "••••");
</script>
<div class="flex items-center gap-2">
  <div>{code}</div>
  <Toggle.Root aria-label="toggle code visibility" bind:pressed={unlocked}>
    <LockKeyOpen class="size-6" />
  </Toggle.Root>
</div>
```