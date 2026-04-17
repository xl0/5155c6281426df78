## Toggle Group

Groups multiple toggle controls, allowing users to enable one or multiple options.

### Basic Structure
```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
</script>
<ToggleGroup.Root>
  <ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

### Single & Multiple Modes
- `type="single"`: Only one item selected at a time, `value` is a string
- `type="multiple"`: Multiple items can be selected, `value` is a string array

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
</script>
<ToggleGroup.Root type="single" bind:value={myValue}>
  <!-- -->
</ToggleGroup.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<ToggleGroup.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</ToggleGroup.Root>
```

### ToggleGroup.Root Props
- `type` (required): `'single'` | `'multiple'` - determines value type
- `value` ($bindable): `string` | `string[]` - current selection
- `onValueChange`: callback when value changes
- `disabled`: boolean (default: false)
- `loop`: boolean (default: true) - loop when navigating
- `orientation`: `'horizontal'` | `'vertical'` (default: 'horizontal')
- `rovingFocus`: boolean (default: true) - use roving focus navigation
- `ref` ($bindable): `HTMLDivElement`
- `children`: Snippet
- `child`: Snippet for render delegation

**Data attributes:**
- `data-orientation`: 'horizontal' | 'vertical'
- `data-toggle-group-root`: present on root

### ToggleGroup.Item Props
- `value` (required): `string` - item identifier
- `disabled`: boolean (default: false)
- `ref` ($bindable): `HTMLButtonElement`
- `children`: Snippet
- `child`: Snippet for render delegation

**Data attributes:**
- `data-state`: 'on' | 'off'
- `data-value`: item value
- `data-orientation`: 'horizontal' | 'vertical'
- `data-disabled`: present when disabled
- `data-toggle-group-item`: present on item

### Example with Icons
```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextStrikethrough from "phosphor-svelte/lib/TextStrikethrough";
  let value = $state(["bold"]);
</script>
<ToggleGroup.Root bind:value type="multiple">
  <ToggleGroup.Item aria-label="toggle bold" value="bold">
    <TextB />
  </ToggleGroup.Item>
  <ToggleGroup.Item aria-label="toggle italic" value="italic">
    <TextItalic />
  </ToggleGroup.Item>
  <ToggleGroup.Item aria-label="toggle strikethrough" value="strikethrough">
    <TextStrikethrough />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```