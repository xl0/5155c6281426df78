## Separator

A headless UI component for visually separating content or UI elements.

### Basic Usage

```svelte
import { Separator } from "bits-ui";

<Separator.Root />
```

### Examples

Horizontal separator (default):
```svelte
<div class="space-y-1">
  <h4>Bits UI</h4>
  <p>Headless UI components for Svelte.</p>
</div>
<Separator.Root class="bg-border my-4 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full" />
```

Vertical separators in a row:
```svelte
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator.Root orientation="vertical" class="bg-border data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[1px]" />
  <div>Docs</div>
  <Separator.Root orientation="vertical" class="bg-border data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[1px]" />
  <div>Source</div>
</div>
```

### API

**Separator.Root** - The separator element.

Props:
- `orientation` (enum: 'horizontal' | 'vertical', default: 'horizontal') - The orientation of the separator
- `decorative` (boolean, default: false) - Whether the separator is decorative; affects screen reader announcement
- `ref` (bindable HTMLDivElement, default: null) - Reference to the underlying DOM element
- `children` (Snippet) - Child content to render
- `child` (Snippet with SnippetProps) - Render delegation for custom elements

Data attributes:
- `data-orientation` - 'horizontal' or 'vertical'
- `data-separator-root` - Present on the root element