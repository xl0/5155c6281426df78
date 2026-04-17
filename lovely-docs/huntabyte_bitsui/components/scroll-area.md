## Scroll Area

Provides a consistent scroll area component across platforms with customizable scrollbar behavior.

### Basic Structure

```svelte
import { ScrollArea } from "bits-ui";

<ScrollArea.Root>
  <ScrollArea.Viewport>
    <!-- Scrollable content -->
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
```

### Reusable Component Pattern

Create a custom `MyScrollArea.svelte` that accepts `orientation` ('vertical' | 'horizontal' | 'both') and `viewportClasses` props to reduce boilerplate:

```svelte
<script lang="ts">
  import { ScrollArea, type WithoutChild } from "bits-ui";
  type Props = WithoutChild<ScrollArea.RootProps> & {
    orientation: "vertical" | "horizontal" | "both";
    viewportClasses?: string;
  };
  let { ref = $bindable(null), orientation = "vertical", viewportClasses, children, ...restProps } = $props();
</script>

{#snippet Scrollbar({ orientation }) }
  <ScrollArea.Scrollbar {orientation}>
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
{/snippet}

<ScrollArea.Root bind:ref {...restProps}>
  <ScrollArea.Viewport class={viewportClasses}>
    {@render children?.()}
  </ScrollArea.Viewport>
  {#if orientation === "vertical" || orientation === "both"}
    {@render Scrollbar({ orientation: "vertical" })}
  {/if}
  {#if orientation === "horizontal" || orientation === "both"}
    {@render Scrollbar({ orientation: "horizontal" })}
  {/if}
  <ScrollArea.Corner />
</ScrollArea.Root>
```

### Scroll Area Types

- **hover** (default): Shows scrollbars only on hover when content exceeds viewport
- **scroll**: Shows scrollbars while scrolling (macOS-like behavior)
- **auto**: Shows scrollbars when content exceeds viewport, remains visible
- **always**: Always shows scrollbars, even if content fits viewport

```svelte
<MyScrollArea type="hover" />
<MyScrollArea type="scroll" />
<MyScrollArea type="auto" />
<MyScrollArea type="always" orientation="both" />
```

### Customization

Hide delay for scrollbars (default 600ms):
```svelte
<MyScrollArea scrollHideDelay={10} />
```

### API Reference

**ScrollArea.Root**
- `type`: 'hover' | 'scroll' | 'auto' | 'always' (default: 'hover')
- `scrollHideDelay`: number in ms (default: 600)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation
- Data attribute: `data-scroll-area-root`

**ScrollArea.Viewport**
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- Data attribute: `data-scroll-area-viewport`

**ScrollArea.Scrollbar**
- `orientation` (required): 'horizontal' | 'vertical'
- `forceMount`: boolean (default: false)
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation
- Data attributes: `data-state` ('visible' | 'hidden'), `data-scroll-area-scrollbar-x`, `data-scroll-area-scrollbar-y`

**ScrollArea.Thumb**
- `forceMount`: boolean (default: false)
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation
- Data attributes: `data-state` ('visible' | 'hidden'), `data-scroll-area-thumb-x`, `data-scroll-area-thumb-y`

**ScrollArea.Corner**
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet for render delegation
- Data attribute: `data-scroll-area-corner`