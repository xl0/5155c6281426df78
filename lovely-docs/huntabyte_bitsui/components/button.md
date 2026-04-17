## Button Component

A flexible component that renders as either a `<button>` or `<a>` tag depending on whether the `href` prop is provided.

### Basic Usage

```svelte
<script lang="ts">
  import { Button } from "bits-ui";
</script>

<Button.Root>
  Unlimited
</Button.Root>
```

With href (renders as anchor):
```svelte
<Button.Root href="/path">Link Button</Button.Root>
```

### API Reference

**Button.Root Props:**
- `href` (string, optional): Converts button to anchor tag when provided. Default: undefined
- `disabled` (boolean): Disables interaction. Default: false
- `ref` (bindable HTMLButtonElement): Reference to underlying DOM element. Default: null
- `children` (Snippet): Content to render

**Data Attributes:**
- `data-button-root`: Present on the button element