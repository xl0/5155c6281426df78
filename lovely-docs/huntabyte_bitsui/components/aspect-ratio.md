## Aspect Ratio Component

Maintains a specified aspect ratio for content.

### Basic Usage
```svelte
import { AspectRatio } from "bits-ui";

<AspectRatio.Root ratio={14 / 9}>
  <img src="/abstract.png" alt="an abstract painting" />
</AspectRatio.Root>
```

### Architecture
- **Root**: Contains the aspect ratio logic

### Reusable Component Pattern
```svelte
// MyAspectRatio.svelte
import { AspectRatio, type WithoutChildrenOrChild } from "bits-ui";

let {
  src,
  alt,
  ref = $bindable(null),
  imageRef = $bindable(null),
  ...restProps
}: WithoutChildrenOrChild<AspectRatio.RootProps> & {
  src: string;
  alt: string;
  imageRef?: HTMLImageElement | null;
} = $props();

<AspectRatio.Root {...restProps} bind:ref>
  <img {src} {alt} bind:this={imageRef} />
</AspectRatio.Root>
```

Usage:
```svelte
<MyAspectRatio src="https://example.com/image.jpg" alt="painting" ratio={4 / 3} />
```

### API Reference

**AspectRatio.Root**

| Property | Type | Description |
|----------|------|-------------|
| `ratio` | `number` | The desired aspect ratio. Default: 1 |
| `ref` $bindable | `HTMLDivElement` | Reference to the underlying DOM element. Default: null |
| `children` | `Snippet` | The children content to render. Default: undefined |
| `child` | `Snippet` | Render delegation for custom elements. Default: undefined |

Data Attributes:
- `data-aspect-ratio-root`: Present on the root element