## Menubar Component

A horizontal bar containing a collection of menus with support for nested submenus, radio groups, checkbox items, and keyboard navigation.

### Basic Structure

```svelte
<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Item>Item 1</Menubar.Item>
        <Menubar.CheckboxItem bind:checked={value}>
          {#snippet children({ checked })}
            {checked ? "✅" : ""} Label
          {/snippet}
        </Menubar.CheckboxItem>
        <Menubar.RadioGroup bind:value={selected}>
          <Menubar.RadioItem value="option1">
            {#snippet children({ checked })}
              {checked ? "✅" : ""} Option 1
            {/snippet}
          </Menubar.RadioItem>
        </Menubar.RadioGroup>
        <Menubar.Sub>
          <Menubar.SubTrigger>Submenu</Menubar.SubTrigger>
          <Menubar.SubContent>
            <Menubar.Item>Sub Item</Menubar.Item>
          </Menubar.SubContent>
        </Menubar.Sub>
        <Menubar.Separator />
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let activeValue = $state("");
</script>
<Menubar.Root bind:value={activeValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>
```

**Fully controlled with function bindings:**
```svelte
<script>
  let activeValue = $state("");
  function getValue() { return activeValue; }
  function setValue(newValue) { activeValue = newValue; }
</script>
<Menubar.Root bind:value={getValue, setValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>
```

### Checkbox Items

```svelte
<script>
  let notifications = $state(true);
</script>
<Menubar.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{/if}
    Notifications
  {/snippet}
</Menubar.CheckboxItem>
```

### Checkbox Groups

```svelte
<script>
  let colors = $state<string[]>([]);
</script>
<Menubar.CheckboxGroup bind:value={colors}>
  <Menubar.GroupHeading>Favorite color</Menubar.GroupHeading>
  <Menubar.CheckboxItem value="red">
    {#snippet children({ checked })}
      {checked ? "✅" : ""} Red
    {/snippet}
  </Menubar.CheckboxItem>
  <Menubar.CheckboxItem value="blue">
    {#snippet children({ checked })}
      {checked ? "✅" : ""} Blue
    {/snippet}
  </Menubar.CheckboxItem>
</Menubar.CheckboxGroup>
```

### Radio Groups

```svelte
<script>
  let value = $state("one");
</script>
<Menubar.RadioGroup bind:value>
  {#each ["one", "two", "three"] as val}
    <Menubar.RadioItem value={val}>
      {#snippet children({ checked })}
        {checked ? "✅" : ""} {val}
      {/snippet}
    </Menubar.RadioItem>
  {/each}
</Menubar.RadioGroup>
```

### Nested Menus

```svelte
<Menubar.Content>
  <Menubar.Item>Item 1</Menubar.Item>
  <Menubar.Sub>
    <Menubar.SubTrigger>Open Sub Menu</Menubar.SubTrigger>
    <Menubar.SubContent>
      <Menubar.Item>Sub Item 1</Menubar.Item>
      <Menubar.Item>Sub Item 2</Menubar.Item>
    </Menubar.SubContent>
  </Menubar.Sub>
</Menubar.Content>
```

### Reusable Components

```svelte
<!-- MyMenubarMenu.svelte -->
<script lang="ts">
  import { Menubar, type WithoutChildrenOrChild } from "bits-ui";
  type Props = WithoutChildrenOrChild<Menubar.MenuProps> & {
    triggerText: string;
    items: { label: string; value: string; onSelect?: () => void }[];
    contentProps?: WithoutChildrenOrChild<Menubar.ContentProps>;
  };
  let { triggerText, items, contentProps, ...restProps }: Props = $props();
</script>
<Menubar.Menu {...restProps}>
  <Menubar.Trigger>{triggerText}</Menubar.Trigger>
  <Menubar.Content {...contentProps}>
    <Menubar.Group aria-label={triggerText}>
      {#each items as item}
        <Menubar.Item textValue={item.label} onSelect={item.onSelect}>
          {item.label}
        </Menubar.Item>
      {/each}
    </Menubar.Group>
  </Menubar.Content>
</Menubar.Menu>
```

Usage:
```svelte
<script>
  import { Menubar } from "bits-ui";
  import MyMenubarMenu from "./MyMenubarMenu.svelte";
  const menubarMenus = [
    { title: "Sales", items: [{label: "Michael Scott", value: "michael"}] },
    { title: "HR", items: [{label: "Toby Flenderson", value: "toby"}] },
  ];
</script>
<Menubar.Root>
  {#each menubarMenus as { title, items }}
    <MyMenubarMenu triggerText={title} {items} />
  {/each}
</Menubar.Root>
```

### Svelte Transitions

Use `forceMount` with the `child` snippet to enable transitions:

```svelte
<script>
  import { fly } from "svelte/transition";
</script>
<Menubar.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <Menubar.Item>Item 1</Menubar.Item>
          <Menubar.Item>Item 2</Menubar.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</Menubar.Content>
```

### API Reference

**Menubar.Root** - Root menubar component managing state
- `value` $bindable: `string` - Currently active menu value
- `onValueChange`: `(value: string) => void` - Callback when active menu changes
- `dir`: `'ltr' | 'rtl'` - Reading direction (default: 'ltr')
- `loop`: `boolean` - Loop through triggers with keyboard (default: true)
- `ref` $bindable: `HTMLDivElement`

**Menubar.Menu** - Menu within the menubar
- `value`: `string` - Menu identifier
- `onOpenChange`: `(open: boolean) => void` - Callback when open state changes

**Menubar.Trigger** - Button toggling dropdown menu
- `disabled`: `boolean` (default: false)
- `ref` $bindable: `HTMLButtonElement`
- Data attributes: `data-state` ('open' | 'closed'), `data-menubar-trigger`

**Menubar.Portal** - Portals content to body or custom target
- `to`: `Element | string` - Portal target (default: document.body)
- `disabled`: `boolean` - Disable portal (default: false)

**Menubar.Content** - Content displayed when menu is open
- `side`: `'top' | 'bottom' | 'left' | 'right'` (default: 'bottom')
- `sideOffset`: `number` - Distance from anchor (default: 0)
- `align`: `'start' | 'center' | 'end'` (default: 'start')
- `alignOffset`: `number` (default: 0)
- `avoidCollisions`: `boolean` - Prevent boundary collisions (default: true)
- `sticky`: `'partial' | 'always'` - Sticky behavior (default: 'partial')
- `hideWhenDetached`: `boolean` (default: true)
- `strategy`: `'fixed' | 'absolute'` - Positioning strategy (default: 'fixed')
- `preventScroll`: `boolean` - Prevent body scroll (default: true)
- `trapFocus`: `boolean` - Trap focus in content (default: true)
- `forceMount`: `boolean` - Force mount for transitions (default: false)
- `loop`: `boolean` - Loop through items with keyboard (default: false)
- `dir`: `'ltr' | 'rtl'` (default: 'ltr')
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-state`, `data-menubar-content`
- CSS variables: `--bits-menubar-menu-content-transform-origin`, `--bits-menubar-menu-content-available-width`, `--bits-menubar-menu-content-available-height`, `--bits-menubar-menu-anchor-width`, `--bits-menubar-menu-anchor-height`

**Menubar.Item** - Menu item
- `disabled`: `boolean` (default: false)
- `textValue`: `string` - For typeahead
- `onSelect`: `() => void` - Selection callback
- `closeOnSelect`: `boolean` (default: true)
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-orientation` ('vertical'), `data-highlighted`, `data-disabled`, `data-menubar-item`

**Menubar.CheckboxGroup** - Group of checkbox items
- `value` $bindable: `string[]` - Selected values (default: [])
- `onValueChange`: `(value: string[]) => void` - Change callback
- `ref` $bindable: `HTMLDivElement`
- Data attribute: `data-menubar-checkbox-group`

**Menubar.CheckboxItem** - Checkbox menu item
- `disabled`: `boolean` (default: false)
- `checked` $bindable: `boolean` (default: false)
- `onCheckedChange`: `(checked: boolean) => void`
- `indeterminate` $bindable: `boolean` (default: false)
- `onIndeterminateChange`: `(indeterminate: boolean) => void`
- `value`: `string` - For use in CheckboxGroup
- `textValue`: `string` - For typeahead
- `onSelect`: `() => void`
- `closeOnSelect`: `boolean` (default: true)
- `ref` $bindable: `HTMLDivElement`
- Children snippet: `{ checked: boolean; indeterminate: boolean; }`
- Data attributes: `data-orientation`, `data-highlighted`, `data-disabled`, `data-state` ('checked' | 'unchecked' | 'indeterminate'), `data-menubar-checkbox-item`

**Menubar.RadioGroup** - Group of radio items
- `value` $bindable: `string` - Currently checked value
- `onValueChange`: `(value: string) => void`
- `ref` $bindable: `HTMLDivElement`
- Data attribute: `data-menubar-radio-group`

**Menubar.RadioItem** - Radio button menu item (must be child of RadioGroup)
- `value` required: `string` - Item value
- `disabled`: `boolean` (default: false)
- `textValue`: `string` - For typeahead
- `onSelect`: `() => void`
- `closeOnSelect`: `boolean` (default: true)
- `ref` $bindable: `HTMLDivElement`
- Children snippet: `{ checked: boolean; }`
- Data attributes: `data-orientation`, `data-highlighted`, `data-disabled`, `data-state` ('checked' | 'unchecked'), `data-value`, `data-menubar-radio-item`

**Menubar.Separator** - Visual separator
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-orientation` ('vertical'), `data-menu-separator`, `data-menubar-separator`

**Menubar.Arrow** - Optional arrow pointing to trigger
- `width`: `number` - Arrow width in pixels (default: 8)
- `height`: `number` - Arrow height in pixels (default: 8)
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-state`, `data-menubar-arrow`

**Menubar.Group** - Group of menu items
- `ref` $bindable: `HTMLDivElement`
- Data attribute: `data-menubar-group`

**Menubar.GroupHeading** - Heading for a group (skipped in keyboard navigation)
- `ref` $bindable: `HTMLDivElement`
- Data attribute: `data-menubar-group-heading`

**Menubar.Sub** - Submenu
- `open` $bindable: `boolean` (default: false)
- `onOpenChange`: `(open: boolean) => void`
- `onOpenChangeComplete`: `(open: boolean) => void` - After animations complete

**Menubar.SubTrigger** - Menu item opening submenu
- `disabled`: `boolean` (default: false)
- `openDelay`: `number` - Delay before submenu opens in ms (default: 100)
- `textValue`: `string` - For typeahead
- `onSelect`: `() => void`
- `ref` $bindable: `HTMLDivElement`
- Data attributes: `data-orientation`, `data-highlighted`, `data-disabled`, `data-state`, `data-menubar-sub-trigger`

**Menubar.SubContent** - Submenu content (with Floating UI)
- Same positioning options as Menubar.Content (side, sideOffset, align, alignOffset, avoidCollisions, etc.)
- Data attributes: `data-state`, `data-menubar-sub-content`

**Menubar.SubContentStatic** - Submenu content (without Floating UI)
- `trapFocus`: `boolean` (default: true)
- `forceMount`: `boolean` (default: false)
- `loop`: `boolean` - Loop through items (default: true)
- `dir`: `'ltr' | 'rtl'` (default: 'ltr')
- Data attributes: `data-state`, `data-menubar-sub-content`

Note: Checkbox group values do not persist between menu open/close cycles; store in `$state` variable and pass to `value` prop to persist.