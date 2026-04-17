## Tabs Component

Organizes content into tabbed sections.

### Basic Structure
```svelte
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger />
  </Tabs.List>
  <Tabs.Content />
</Tabs.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { Tabs } from "bits-ui";
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "tab-1")}> Activate tab 1 </button>
<Tabs.Root bind:value={myValue}>
  <!-- -->
</Tabs.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<Tabs.Root bind:value={getValue, setValue}>
  <!-- ... -->
</Tabs.Root>
```

### Orientation & Activation

- `orientation` prop: `'horizontal'` (default, uses ArrowLeft/Right) or `'vertical'` (uses ArrowUp/Down)
- `activationMode` prop: `'automatic'` (default, activates on focus) or `'manual'` (requires pressing trigger)

```svelte
<Tabs.Root orientation="vertical" activationMode="manual">
  <!-- ... -->
</Tabs.Root>
```

### API Reference

**Tabs.Root**
- `value` (bindable): string - active tab value
- `onValueChange`: (value: string) => void callback
- `activationMode`: 'automatic' | 'manual' (default: 'automatic')
- `disabled`: boolean (default: false)
- `loop`: boolean - keyboard navigation loops (default: true)
- `orientation`: 'horizontal' | 'vertical' (default: 'horizontal')
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-orientation`, `data-tabs-root`

**Tabs.List**
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-orientation`, `data-tabs-list`

**Tabs.Trigger**
- `value` (required): string - tab value this trigger represents
- `disabled`: boolean (default: false)
- `ref` (bindable): HTMLButtonElement
- Data attributes: `data-state` ('active' | 'inactive'), `data-value`, `data-orientation`, `data-disabled`, `data-tabs-trigger`

**Tabs.Content**
- `value` (required): string - tab value this content represents
- `ref` (bindable): HTMLDivElement
- Data attributes: `data-tabs-content`