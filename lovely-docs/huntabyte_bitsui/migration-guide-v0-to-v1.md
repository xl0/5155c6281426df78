## Overview
Bits UI v1 is a complete rewrite for Svelte 5 with breaking changes from v0.x. Key benefits include performance improvements, more flexible APIs, bug fixes, and better developer experience.

## Shared Changes Across All Components
- `el` prop → `ref` prop for HTML element references
- `asChild` prop → `child` snippet prop for component composition
- `transition` props removed → use `child` snippet with `forceMount` and Svelte transitions instead
- `let:` directives → `children`/`child` snippet props for exposing component data

## Component-Specific Changes

**Accordion**
- `multiple` prop removed → replaced with required `type` prop (`'single'` or `'multiple'`)
- `transition` props removed from `Accordion.Content`

**Alert Dialog**
- `transition` props removed from `AlertDialog.Content` and `AlertDialog.Overlay`
- Must wrap `AlertDialog.Content` in `AlertDialog.Portal` to render in portal
- `AlertDialog.Action` no longer closes dialog by default (use form submission pattern instead)

**Button**
- `builders` prop removed → use `child` snippet on components instead

**Checkbox**
- `Checkbox.Indicator` removed → use `children` snippet to access `checked` state
- `Checkbox.Input` removed → hidden input auto-renders when `name` prop provided to `Checkbox.Root`
- `checked` state type changed from `boolean | 'indeterminate'` to `boolean` (indeterminate is separate state via `indeterminate` prop)
- New `Checkbox.Group` component added

**Combobox**
- `multiple` prop removed → replaced with required `type` prop (`'single'` or `'multiple'`)
- `selected` prop → `value` prop (string or string[] if `type="multiple"`)
- Hidden input auto-renders when `name` prop provided
- `Combobox.ItemIndicator` removed → use `children` snippet to access `selected` state
- New `Combobox.Group` and `Combobox.GroupHeading` components added
- Auto-portalling removed → wrap `Combobox.Content` in `Combobox.Portal` (accepts `to` and `disabled` props)

**Context Menu / Dropdown Menu / Menubar Menu**
- `*Menu.RadioIndicator` and `*Menu.CheckboxIndicator` removed → use `children` snippet to access `checked`/`selected` state
- `*Menu.Label` → `*Menu.GroupHeading` for group headings
- `href` prop on `.Item` removed → use `child` snippet to render anchor element
- Auto-portalling removed → wrap `*Menu.Content` in `*Menu.Portal` (accepts `to` and `disabled` props)

**Pin Input**
- Completely overhauled to function as OTP input component (based on Input OTP library)
- Refer to documentation for migration details

**Popover**
- Auto-portalling removed → wrap `Popover.Content` in `Popover.Portal` (accepts `to` and `disabled` props)

**Radio Group**
- `RadioGroup.ItemIndicator` removed → use `children` snippet to access `checked` state

**Scroll Area**
- `ScrollArea.Content` removed (not necessary in v1)

**Select**
- `multiple` prop removed → replaced with required `type` prop (`'single'` or `'multiple'`)
- `selected` prop → `value` prop (string or string[] if `type="multiple"`)
- Hidden input auto-renders when `name` prop provided
- `Select.ItemIndicator` removed → use `children` snippet to access `selected` state
- `Select.Value` removed → use `value` prop to render custom label in trigger
- New `Select.Group` and `Select.GroupHeading` components added
- Auto-portalling removed → wrap `Select.Content` in `Select.Portal` (accepts `to` and `disabled` props)

**Slider**
- `Slider.Root` requires `type` prop (`'single'` or `'multiple'`)
- New `onValueCommit` callback fires when user commits value change (mouse release, Enter key), not on every movement

**Tooltip**
- New required `Tooltip.Provider` component replaces `group` prop from v0
- Wrap app or section with `Tooltip.Provider` to provide shared context