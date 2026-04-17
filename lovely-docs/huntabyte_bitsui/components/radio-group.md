## Radio Group

Groups multiple radio items under a common name for form submission.

### Basic Usage

```svelte
<script lang="ts">
  import { Label, RadioGroup } from "bits-ui";
</script>
<RadioGroup.Root class="flex flex-col gap-4">
  <div class="flex items-center">
    <RadioGroup.Item id="amazing" value="amazing" class="size-5 rounded-full border" />
    <Label.Root for="amazing" class="pl-3">Amazing</Label.Root>
  </div>
  <div class="flex items-center">
    <RadioGroup.Item id="average" value="average" class="size-5 rounded-full border" />
    <Label.Root for="average" class="pl-3">Average</Label.Root>
  </div>
</RadioGroup.Root>
```

### Structure with Snippets

```svelte
<RadioGroup.Root>
  <RadioGroup.Item>
    {#snippet children({ checked })}
      {#if checked}✅{/if}
    {/snippet}
  </RadioGroup.Item>
</RadioGroup.Root>
```

### Reusable Component Pattern

Create a custom component accepting an array of items:

```svelte
<script lang="ts">
  import { RadioGroup, Label, useId } from "bits-ui";
  type Item = { value: string; label: string; disabled?: boolean };
  type Props = RadioGroup.RootProps & { items: Item[] };
  let { value = $bindable(""), items, ...restProps }: Props = $props();
</script>
<RadioGroup.Root bind:value {...restProps}>
  {#each items as item}
    {@const id = useId()}
    <div>
      <RadioGroup.Item {id} value={item.value} disabled={item.disabled}>
        {#snippet children({ checked })}
          {#if checked}✅{/if}
        {/snippet}
      </RadioGroup.Item>
      <Label.Root for={id}>{item.label}</Label.Root>
    </div>
  {/each}
</RadioGroup.Root>
```

Usage:
```svelte
<MyRadioGroup items={[
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "coconut", label: "Coconut", disabled: true }
]} name="favoriteFruit" />
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "A")}>Select A</button>
<RadioGroup.Root bind:value={myValue}><!-- ... --></RadioGroup.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<RadioGroup.Root bind:value={getValue, setValue}><!-- ... --></RadioGroup.Root>
```

### HTML Forms

Set `name` prop to render hidden input for form submission:
```svelte
<RadioGroup.Root name="favoriteFruit" required><!-- ... --></RadioGroup.Root>
```

### Disabling & Readonly

```svelte
<RadioGroup.Item value="apple" disabled>Apple</RadioGroup.Item>
<RadioGroup.Root readonly><!-- ... --></RadioGroup.Root>
<RadioGroup.Root disabled><!-- ... --></RadioGroup.Root>
```

### Orientation & Navigation

```svelte
<RadioGroup.Root orientation="vertical"><!-- ArrowUp/Down --></RadioGroup.Root>
<RadioGroup.Root orientation="horizontal"><!-- ArrowLeft/Right --></RadioGroup.Root>
<RadioGroup.Root loop><!-- Loops through items --></RadioGroup.Root>
```

### API Reference

**RadioGroup.Root props:**
- `value` ($bindable): string - currently selected value
- `onValueChange`: (value: string) => void
- `disabled`: boolean (default: false)
- `required`: boolean (default: false)
- `name`: string - for form submission
- `loop`: boolean (default: false) - keyboard navigation loops
- `orientation`: 'vertical' | 'horizontal' (default: 'vertical')
- `readonly`: boolean (default: false) - focusable but not changeable
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation

**Data attributes on Root:**
- `data-orientation`: 'vertical' | 'horizontal'
- `data-disabled`: present when disabled
- `data-readonly`: present when readonly
- `data-radio-group-root`: always present

**RadioGroup.Item props:**
- `value` (required): string - unique identifier
- `disabled`: boolean (default: false)
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet for render delegation

**Data attributes on Item:**
- `data-disabled`: present when disabled
- `data-readonly`: present when parent is readonly
- `data-value`: the item's value
- `data-state`: 'checked' | 'unchecked'
- `data-orientation`: parent's orientation
- `data-radio-group-item`: always present