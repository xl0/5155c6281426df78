## Checkbox Component

Enables users to select or deselect options with support for indeterminate states.

### Key Features
- **Tri-State Support**: Checked, unchecked, and indeterminate states
- **Accessibility**: WAI-ARIA guidelines, keyboard navigation, screen reader support
- **Flexible State Management**: Controlled and uncontrolled state support

### Basic Usage

```svelte
<script lang="ts">
  import { Checkbox, Label } from "bits-ui";
  import Check from "phosphor-svelte/lib/Check";
  import Minus from "phosphor-svelte/lib/Minus";
</script>

<Checkbox.Root id="terms" aria-labelledby="terms-label" indeterminate>
  {#snippet children({ checked, indeterminate })}
    <div>
      {#if indeterminate}
        <Minus class="size-[15px]" weight="bold" />
      {:else if checked}
        <Check class="size-[15px]" weight="bold" />
      {/if}
    </div>
  {/snippet}
</Checkbox.Root>
<Label.Root id="terms-label" for="terms">
  Accept terms and conditions
</Label.Root>
```

### Reusable Component Pattern

```svelte
<script lang="ts">
  import { Checkbox, Label, useId, type WithoutChildrenOrChild } from "bits-ui";
  let {
    id = useId(),
    checked = $bindable(false),
    ref = $bindable(null),
    labelRef = $bindable(null),
    labelText,
    ...restProps
  }: WithoutChildrenOrChild<Checkbox.RootProps> & {
    labelText: string;
    labelRef?: HTMLLabelElement | null;
  } = $props();
</script>

<Checkbox.Root {id} bind:checked bind:ref {...restProps}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{:else}❌{/if}
  {/snippet}
</Checkbox.Root>
<Label.Root for={id} bind:ref={labelRef}>{labelText}</Label.Root>
```

Usage: `<MyCheckbox labelText="Enable notifications" />`

### Managing Checked State

**Two-Way Binding:**
```svelte
<script lang="ts">
  let myChecked = $state(false);
</script>
<button onclick={() => (myChecked = false)}>uncheck</button>
<Checkbox.Root bind:checked={myChecked} />
```

**Fully Controlled (Function Binding):**
```svelte
<script lang="ts">
  let myChecked = $state(false);
  function getChecked() { return myChecked; }
  function setChecked(newChecked: boolean) { myChecked = newChecked; }
</script>
<Checkbox.Root bind:checked={getChecked, setChecked} />
```

### Managing Indeterminate State

**Two-Way Binding:**
```svelte
<script lang="ts">
  let myIndeterminate = $state(true);
</script>
<button onclick={() => (myIndeterminate = false)}>clear indeterminate</button>
<MyCheckbox bind:indeterminate={myIndeterminate} />
```

**Fully Controlled:**
```svelte
<script lang="ts">
  let myIndeterminate = $state(true);
  function getIndeterminate() { return myIndeterminate; }
  function setIndeterminate(newIndeterminate: boolean) { myIndeterminate = newIndeterminate; }
</script>
<Checkbox.Root bind:indeterminate={getIndeterminate, setIndeterminate} />
```

### Disabled State
```svelte
<MyCheckbox disabled labelText="Enable notifications" />
```

### HTML Forms

**Basic form submission** (submits `'on'` by default when checked):
```svelte
<MyCheckbox name="notifications" labelText="Enable notifications" />
```

**Custom value:**
```svelte
<MyCheckbox value="hello" name="notifications" labelText="Enable notifications" />
```

**Required:**
```svelte
<Checkbox.Root required><!-- ... --></Checkbox.Root>
```

### Checkbox Groups

```svelte
<script lang="ts">
  let myValue = $state<string[]>(["marketing", "news"]);
</script>

<Checkbox.Group bind:value={myValue} name="notifications" onValueChange={console.log}>
  <Checkbox.GroupLabel>Notifications</Checkbox.GroupLabel>
  <Checkbox.Root value="marketing" />
  <Checkbox.Root value="promotions" />
  <Checkbox.Root value="news" />
</Checkbox.Group>
```

**Managing Group Value - Two-Way Binding:**
```svelte
<script lang="ts">
  let myValue = $state<string[]>([]);
</script>
<button onclick={() => { myValue = ["item-1", "item-2"]; }}>Open Items 1 and 2</button>
<Checkbox.Group name="myItems" bind:value={myValue}>
  <Checkbox.GroupLabel>Items</Checkbox.GroupLabel>
  <Checkbox.Root value="item-1" />
  <Checkbox.Root value="item-2" />
  <Checkbox.Root value="item-3" />
</Checkbox.Group>
```

**Fully Controlled:**
```svelte
<script lang="ts">
  let myValue = $state<string[]>([]);
  function getValue() { return myValue; }
  function setValue(newValue: string[]) { myValue = newValue; }
</script>
<Checkbox.Group bind:value={getValue, setValue}><!-- ... --></Checkbox.Group>
```

**Group Form Submission:**
```svelte
<Checkbox.Group name="notifications"><!-- ... --></Checkbox.Group>
```
When a name is provided to `Checkbox.Group`, hidden `<input />` elements are rendered for each checkbox. Descendant checkboxes inherit `name`, `required`, and `disabled` from the group.

### API Reference

**Checkbox.Root Properties:**
- `checked` $bindable: `boolean` (default: false) - The checkbox's checked state
- `onCheckedChange`: `(checked: boolean) => void` - Callback when checked state changes
- `indeterminate` $bindable: `boolean` (default: false) - Whether checkbox is indeterminate
- `onIndeterminateChange`: `(indeterminate: boolean) => void` - Callback when indeterminate changes
- `disabled`: `boolean` (default: false) - Prevents user interaction
- `required`: `boolean` (default: false) - Makes checkbox required
- `name`: `string` - Name for form submission; renders hidden input if provided
- `value`: `string` - Value submitted with form when checked
- `readonly`: `boolean` (default: false) - Focusable but not checkable/uncheckable
- `ref` $bindable: `HTMLButtonElement` - Reference to underlying DOM element
- `children`: `Snippet<{ checked: boolean; indeterminate: boolean }>` - Content to render
- `child`: `Snippet<{ props: Record<string, unknown>; checked: boolean; indeterminate: boolean }>` - Render delegation

**Checkbox.Root Data Attributes:**
- `data-state`: `'checked' | 'unchecked' | 'indeterminate'` - Current state
- `data-disabled`: `''` - Present when disabled
- `data-readonly`: `''` - Present when read only
- `data-checkbox-root`: `''` - Present on root element

**Checkbox.Group Properties:**
- `value` $bindable: `string[]` (default: []) - Array of checked checkbox values
- `onValueChange`: `(value: string[]) => void` - Callback when value changes
- `disabled`: `boolean` (default: false) - Disables all checkboxes in group
- `required`: `boolean` (default: false) - Makes group required for form submission
- `name`: `string` - Name for form submission; renders hidden inputs if provided
- `readonly`: `boolean` (default: false) - Focusable but not checkable/uncheckable
- `ref` $bindable: `HTMLDivElement` - Reference to underlying DOM element
- `children`: `Snippet` - Content to render
- `child`: `Snippet<{ props: Record<string, unknown> }>` - Render delegation

**Checkbox.Group Data Attributes:**
- `data-disabled`: `''` - Present when disabled
- `data-checkbox-group`: `''` - Present on group element
- `data-readonly`: `''` - Present when read only

**Checkbox.GroupLabel Properties:**
- `ref` $bindable: `HTMLLabelElement` - Reference to underlying DOM element
- `children`: `Snippet` - Content to render
- `child`: `Snippet<{ props: Record<string, unknown> }>` - Render delegation

**Checkbox.GroupLabel Data Attributes:**
- `data-disabled`: `''` - Present when group is disabled
- `data-checkbox-group-label`: `''` - Present on label element
