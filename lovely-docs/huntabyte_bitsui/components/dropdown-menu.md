## Dropdown Menu Component

A menu component that displays selectable items when triggered. Supports groups, checkboxes, radio buttons, nested submenus, and keyboard navigation.

### Basic Structure
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item />
      <DropdownMenu.CheckboxItem />
      <DropdownMenu.RadioGroup>
        <DropdownMenu.RadioItem />
      </DropdownMenu.RadioGroup>
      <DropdownMenu.Separator />
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<DropdownMenu.Root bind:open={isOpen}>
  <!-- ... -->
</DropdownMenu.Root>
```

**Fully controlled with function bindings:**
```svelte
<script>
  let myOpen = $state(false);
  function getOpen() { return myOpen; }
  function setOpen(newOpen) { myOpen = newOpen; }
</script>
<DropdownMenu.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</DropdownMenu.Root>
```

### Groups
Group related items with `DropdownMenu.Group` and either `DropdownMenu.GroupHeading` or `aria-label`:
```svelte
<DropdownMenu.Group>
  <DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
  <DropdownMenu.Item>New</DropdownMenu.Item>
  <DropdownMenu.Item>Open</DropdownMenu.Item>
</DropdownMenu.Group>
<!-- or -->
<DropdownMenu.Group aria-label="file">
  <DropdownMenu.Item>New</DropdownMenu.Item>
</DropdownMenu.Group>
```

### Radio Groups
Only one item can be selected at a time. State persists in `$state` variable:
```svelte
<script>
  let value = $state("one");
</script>
<DropdownMenu.RadioGroup bind:value>
  <DropdownMenu.GroupHeading>Favorite number</DropdownMenu.GroupHeading>
  {#each ["one", "two", "three"] as val}
    <DropdownMenu.RadioItem {value: val}>
      {#snippet children({ checked })}
        {#if checked}✅{/if}
        {val}
      {/snippet}
    </DropdownMenu.RadioItem>
  {/each}
</DropdownMenu.RadioGroup>
```

### Checkbox Items
Individual checkboxes or checkbox groups:
```svelte
<script>
  let notifications = $state(true);
</script>
<DropdownMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{/if}
    Notifications
  {/snippet}
</DropdownMenu.CheckboxItem>
```

**Checkbox groups** (multiple selections):
```svelte
<script>
  let colors = $state<string[]>([]);
</script>
<DropdownMenu.CheckboxGroup bind:value={colors}>
  <DropdownMenu.GroupHeading>Favorite color</DropdownMenu.GroupHeading>
  <DropdownMenu.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}✅{/if}
      Red
    {/snippet}
  </DropdownMenu.CheckboxItem>
  <!-- more items -->
</DropdownMenu.CheckboxGroup>
```

### Nested Menus
Use `DropdownMenu.Sub` for submenus:
```svelte
<DropdownMenu.Content>
  <DropdownMenu.Item>Item 1</DropdownMenu.Item>
  <DropdownMenu.Sub>
    <DropdownMenu.SubTrigger>Open Sub Menu</DropdownMenu.SubTrigger>
    <DropdownMenu.SubContent>
      <DropdownMenu.Item>Sub Item 1</DropdownMenu.Item>
    </DropdownMenu.SubContent>
  </DropdownMenu.Sub>
</DropdownMenu.Content>
```

### Svelte Transitions
Use `forceMount` with child snippet for transition control:
```svelte
<script>
  import { fly } from "svelte/transition";
</script>
<DropdownMenu.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <DropdownMenu.Item>Item 1</DropdownMenu.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</DropdownMenu.Content>
```

### Custom Anchor
Anchor content to a different element:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Content {customAnchor}>
    <!-- ... -->
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Reusable Component Example
```svelte
<!-- MyDropdownMenu.svelte -->
<script lang="ts">
  import { DropdownMenu, type WithoutChild } from "bits-ui";
  type Props = DropdownMenu.RootProps & {
    buttonText: string;
    items: string[];
    contentProps?: WithoutChild<DropdownMenu.ContentProps>;
  };
  let { open = $bindable(false), buttonText, items, contentProps, ...restProps } = $props();
</script>
<DropdownMenu.Root bind:open {...restProps}>
  <DropdownMenu.Trigger>{buttonText}</DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content {...contentProps}>
      <DropdownMenu.Group aria-label={buttonText}>
        {#each items as item}
          <DropdownMenu.Item textValue={item}>{item}</DropdownMenu.Item>
        {/each}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

Usage: `<MyDropdownMenu buttonText="Select a manager" items={["Michael Scott", "Dwight Schrute", "Jim Halpert"]} />`

### Key Props

**Root:** `open` (bindable), `onOpenChange`, `onOpenChangeComplete`, `dir`

**Trigger:** `disabled`, `ref` (bindable)

**Content:** `side` (top/bottom/left/right), `sideOffset`, `align` (start/center/end), `alignOffset`, `avoidCollisions`, `sticky` (partial/always), `hideWhenDetached`, `strategy` (fixed/absolute), `preventScroll`, `customAnchor`, `trapFocus`, `forceMount`, `loop`, `dir`

**Item:** `disabled`, `textValue`, `onSelect`, `closeOnSelect`

**CheckboxItem:** `disabled`, `checked` (bindable), `onCheckedChange`, `indeterminate` (bindable), `value`, `textValue`, `onSelect`, `closeOnSelect`

**RadioItem:** `value` (required), `disabled`, `textValue`, `onSelect`, `closeOnSelect`

**Sub:** `open` (bindable), `onOpenChange`, `onOpenChangeComplete`

**SubTrigger:** `disabled`, `openDelay` (100ms default), `textValue`, `onSelect`

### Data Attributes
- `data-state`: 'open' | 'closed' (on Trigger, Content, SubTrigger, SubContent, Arrow)
- `data-highlighted`: present when item is highlighted
- `data-disabled`: present when item is disabled
- `data-dropdown-menu-*`: various elements have specific attributes

### CSS Variables
- `--bits-dropdown-menu-content-transform-origin`
- `--bits-dropdown-menu-content-available-width`
- `--bits-dropdown-menu-content-available-height`
- `--bits-dropdown-menu-anchor-width`
- `--bits-dropdown-menu-anchor-height`