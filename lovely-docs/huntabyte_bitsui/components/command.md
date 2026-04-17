## Command Component

A searchable, filterable command menu for quick navigation and action execution.

### Key Features
- Dynamic filtering with customizable scoring algorithm
- Full keyboard navigation support (including vim bindings: ctrl+n/j/p/k)
- Grouped commands with headers
- Empty/loading states
- Accessibility with ARIA attributes
- Grid layout support via `columns` prop

### Architecture
Sub-components: `Root` (state manager), `Input` (search field), `List` (container), `Viewport` (visible area with CSS variables), `Empty`, `Loading`, `Group`, `GroupHeading`, `GroupItems`, `Item`, `LinkItem`, `Separator`

### State Management

**Two-way binding:**
```svelte
<script>
  let myValue = $state("");
</script>
<Command.Root bind:value={myValue}>
  <!-- ... -->
</Command.Root>
```

**Change handler:**
```svelte
<Command.Root onValueChange={(value) => console.log(value)}>
  <!-- ... -->
</Command.Root>
```

**Fully controlled (function binding):**
```svelte
<Command.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
  <!-- ... -->
</Command.Root>
```

### Basic Example
```svelte
<Command.Root>
  <Command.Input placeholder="Search..." />
  <Command.List>
    <Command.Viewport>
      <Command.Empty>No results found.</Command.Empty>
      <Command.Group>
        <Command.GroupHeading>Suggestions</Command.GroupHeading>
        <Command.GroupItems>
          <Command.Item keywords={["getting started"]}>
            Introduction
          </Command.Item>
        </Command.GroupItems>
      </Command.Group>
      <Command.Separator />
    </Command.Viewport>
  </Command.List>
</Command.Root>
```

### Modal Integration
Combine with `Dialog` component. Listen for keyboard shortcut (e.g., Cmd+J) to open:
```svelte
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger>Open Command Menu ⌘J</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Command.Root><!-- ... --></Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Grid Layout
Set `columns` prop for grid display. Example with emoji picker showing 8-column grid with navigation between views:
```svelte
<Command.Root columns={8}>
  <Command.Input bind:value={search} />
  <Command.List>
    <Command.Viewport>
      <Command.Group>
        <Command.GroupItems class="grid grid-cols-8 gap-2">
          <Command.Item>🎉</Command.Item>
          <!-- ... -->
        </Command.GroupItems>
      </Command.Group>
    </Command.Viewport>
  </Command.List>
</Command.Root>
```

### Filtering

**Custom filter function** (returns 0-1 score):
```svelte
<Command.Root filter={(value, search, keywords) => {
  return value.includes(search) ? 1 : 0;
}}>
```

**Extend default filter:**
```svelte
<Command.Root filter={(value, search, keywords) => {
  const score = computeCommandScore(value, search, keywords);
  // custom logic
  return score;
}}>
```

**Disable filtering:**
```svelte
<Command.Root shouldFilter={false}>
```

### Item Selection
```svelte
<Command.Item onSelect={() => console.log("selected!")}>Item</Command.Item>
```

### Links
Use `Command.LinkItem` for anchor elements with preloading:
```svelte
<Command.LinkItem href="/path" keywords={["nav"]}>Link</Command.LinkItem>
```

### Imperative API
Bind to `Command.Root` for programmatic control:
```svelte
<script>
  let command;
</script>
<Command.Root bind:this={command}>
  <!-- ... -->
</Command.Root>
```

**Methods:**
- `getValidItems()` - returns array of selectable items
- `updateSelectedToIndex(index)` - select item at index
- `updateSelectedByGroup(1 | -1)` - move to next/previous group
- `updateSelectedByItem(1 | -1)` - move to next/previous item

**Example:**
```svelte
<script>
  let command;
  function jumpToLastItem() {
    const items = command.getValidItems();
    if (items.length) command.updateSelectedToIndex(items.length - 1);
  }
</script>
<svelte:window onkeydown={(e) => e.key === "o" && jumpToLastItem()} />
<Command.Root bind:this={command}><!-- ... --></Command.Root>
```

### Common Mistakes
- **Duplicate values**: Each `Command.Item` must have unique `value`. If text content is identical, use `value` prop to differentiate:
```svelte
<Command.Item value="item-1">My Item</Command.Item>
<Command.Item value="item-2">My Item</Command.Item>
```

### Props Reference

**Command.Root:**
- `value` (bindable, string) - selected value
- `onValueChange` (function) - fires on value change
- `label` (string) - accessible label for screen readers
- `filter` (function) - custom filter returning 0-1 score
- `shouldFilter` (boolean, default true) - enable/disable filtering
- `columns` (number) - grid column count
- `onStateChange` (function) - fires on state changes (debounced)
- `loop` (boolean, default false) - wrap around when navigating
- `disablePointerSelection` (boolean) - prevent hover selection
- `vimBindings` (boolean, default true) - enable vim keybindings
- `disableInitialScroll` (boolean) - prevent scroll on mount
- `ref` (bindable, HTMLDivElement)

**Command.Input:**
- `value` (bindable, string) - search query
- `ref` (bindable, HTMLInputElement)

**Command.List, Command.Viewport, Command.Group, Command.GroupHeading, Command.GroupItems, Command.Empty, Command.Loading, Command.Separator:**
- `ref` (bindable, HTMLDivElement)
- `forceMount` (boolean) - always mount regardless of filtering

**Command.Item / Command.LinkItem:**
- `value` (required, string)
- `keywords` (string[]) - additional search terms
- `forceMount` (boolean)
- `onSelect` (function)
- `disabled` (boolean)
- `ref` (bindable, HTMLDivElement)

**Command.Loading:**
- `progress` (number, default 0)

**Data attributes:** `data-command-root`, `data-command-input`, `data-command-list`, `data-command-viewport`, `data-command-group`, `data-command-group-heading`, `data-command-group-items`, `data-command-item`, `data-command-empty`, `data-command-loading`, `data-command-separator`, `data-selected`, `data-disabled`

**CSS variable:** `--bits-command-list-height` (set by Viewport)