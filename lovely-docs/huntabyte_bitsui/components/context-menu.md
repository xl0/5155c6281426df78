## Context Menu

Right-click triggered menu component with support for nested submenus, checkbox items, radio groups, and keyboard navigation.

### Basic Structure
```svelte
<ContextMenu.Root>
  <ContextMenu.Trigger>Right click me</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item>Edit</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item>Delete</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

### State Management
- **Two-way binding**: `let isOpen = $state(false); <ContextMenu.Root bind:open={isOpen}>`
- **Fully controlled**: Use function bindings with getter/setter for complete control

### Nested Menus (Submenus)
```svelte
<ContextMenu.Sub>
  <ContextMenu.SubTrigger>Add</ContextMenu.SubTrigger>
  <ContextMenu.SubContent sideOffset={10}>
    <ContextMenu.Item>Header</ContextMenu.Item>
    <ContextMenu.Item>Paragraph</ContextMenu.Item>
  </ContextMenu.SubContent>
</ContextMenu.Sub>
```

### Checkbox Items
```svelte
<ContextMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}-{:else if checked}✅{/if}
    Notifications
  {/snippet}
</ContextMenu.CheckboxItem>
```

### Checkbox Groups
```svelte
<ContextMenu.CheckboxGroup bind:value={colors}>
  <ContextMenu.GroupHeading>Favorite color</ContextMenu.GroupHeading>
  <ContextMenu.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}✅{/if}
      Red
    {/snippet}
  </ContextMenu.CheckboxItem>
  <!-- more items -->
</ContextMenu.CheckboxGroup>
```
Note: `value` state does not persist between open/close cycles; store in `$state` variable.

### Radio Groups
```svelte
<ContextMenu.RadioGroup bind:value>
  {#each values as val}
    <ContextMenu.RadioItem {value: val}>
      {#snippet children({ checked })}
        {#if checked}✅{/if}
        {val}
      {/snippet}
    </ContextMenu.RadioItem>
  {/each}
</ContextMenu.RadioGroup>
```

### Svelte Transitions
Use `forceMount` prop with `child` snippet to enable transitions:
```svelte
<ContextMenu.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <ContextMenu.Item>Item 1</ContextMenu.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</ContextMenu.Content>
```

### Reusable Component Pattern
Create wrapper component accepting `trigger` snippet, `items` array, and `contentProps`:
```svelte
<ContextMenu.Root bind:open {...restProps}>
  <ContextMenu.Trigger>{@render trigger()}</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content {...contentProps}>
      <ContextMenu.Group>
        <ContextMenu.GroupHeading>Select an Office</ContextMenu.GroupHeading>
        {#each items as item}
          <ContextMenu.Item textValue={item}>{item}</ContextMenu.Item>
        {/each}
      </ContextMenu.Group>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

### Key Components
- **Root**: Manages menu state, accepts `open` (bindable), `onOpenChange`, `onOpenChangeComplete`, `dir`
- **Trigger**: Right-click target, `disabled` prop, emits `data-state` and `data-context-menu-trigger`
- **Portal**: Renders content to body or custom target, `to` and `disabled` props
- **Content**: Menu container with floating UI positioning (side, align, collision handling), `forceMount`, `loop`, `trapFocus`, `preventScroll`
- **ContentStatic**: Non-floating alternative
- **Item**: Menu item with `disabled`, `textValue`, `onSelect`, `closeOnSelect` props
- **CheckboxItem**: Checkbox menu item with `checked`, `indeterminate`, `value` (for groups)
- **CheckboxGroup**: Container for checkbox items, `value` is array of selected
- **RadioItem**: Radio button menu item, requires `value` prop
- **RadioGroup**: Container for radio items, `value` is single selected
- **Separator**: Visual divider
- **Arrow**: Optional pointer to anchor
- **Group**: Item grouping with optional heading
- **GroupHeading**: Label for group (skipped in keyboard nav)
- **Sub/SubTrigger/SubContent**: Submenu structure with `openDelay` prop on trigger

### Data Attributes
- `data-state`: 'open' | 'closed'
- `data-highlighted`: Present when item highlighted
- `data-disabled`: Present when disabled
- `data-context-menu-*`: Component identifiers
- `data-orientation`: 'vertical'

### CSS Variables
- `--bits-context-menu-content-transform-origin`
- `--bits-context-menu-content-available-width/height`
- `--bits-context-menu-anchor-width/height`