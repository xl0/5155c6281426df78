## Switch Component

A toggle control for binary on/off states, commonly used for settings and feature toggles.

### Basic Usage

```svelte
<script lang="ts">
  import { Switch, Label } from "bits-ui";
</script>

<Switch.Root id="dnd" name="hello">
  <Switch.Thumb />
</Switch.Root>
<Label.Root for="dnd">Do not disturb</Label.Root>
```

### Architecture

Two-part component:
- **Root**: Manages state and behavior
- **Thumb**: Visual indicator of current state

### Creating Reusable Components

```svelte
<script lang="ts">
  import { Switch, Label, useId } from "bits-ui";
  let {
    id = useId(),
    checked = $bindable(false),
    ref = $bindable(null),
    labelText,
    ...restProps
  } = $props();
</script>

<Switch.Root bind:checked bind:ref {id} {...restProps}>
  <Switch.Thumb />
</Switch.Root>
<Label.Root for={id}>{labelText}</Label.Root>
```

Usage: `<MySwitch bind:checked={notifications} labelText="Enable notifications" />`

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myChecked = $state(true);
</script>
<Switch.Root bind:checked={myChecked} />
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myChecked = $state(false);
  function getChecked() { return myChecked; }
  function setChecked(newChecked: boolean) { myChecked = newChecked; }
</script>
<Switch.Root bind:checked={getChecked, setChecked} />
```

### Disabled State

```svelte
<Switch.Root disabled />
```

### HTML Forms

Hidden input submission with `name` prop:
```svelte
<Switch.Root name="dnd" />
```

Default value is `'on'` when checked. Custom value:
```svelte
<Switch.Root name="dnd" value="hello" />
```

Required switch:
```svelte
<Switch.Root required />
```

### API Reference

**Switch.Root Props:**
- `checked` ($bindable): boolean, default false
- `onCheckedChange`: (checked: boolean) => void callback
- `disabled`: boolean, default false
- `name`: string for form submission
- `required`: boolean, default false
- `value`: string for hidden input value
- `ref` ($bindable): HTMLButtonElement reference
- `children`: Snippet with { checked: boolean }
- `child`: Snippet for render delegation

**Switch.Root Data Attributes:**
- `data-state`: 'checked' | 'unchecked'
- `data-checked`: present when checked
- `data-disabled`: present when disabled
- `data-switch-root`: always present

**Switch.Thumb Props:**
- `ref` ($bindable): HTMLSpanElement reference
- `children`: Snippet with { checked: boolean }
- `child`: Snippet for render delegation

**Switch.Thumb Data Attributes:**
- `data-state`: 'checked' | 'unchecked'
- `data-checked`: present when checked
- `data-switch-thumb`: always present

### Key Features

- WAI-ARIA compliant with keyboard navigation and screen reader support
- Controlled and uncontrolled state management
- Data attributes for styling state transitions
- Form integration with hidden input element