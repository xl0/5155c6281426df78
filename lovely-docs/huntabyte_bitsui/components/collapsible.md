## Overview
Collapsible component for expandable/collapsible content sections. Manages space and organizes information with show/hide functionality.

## Key Features
- ARIA attributes for accessibility and keyboard navigation
- CSS variables and data attributes for smooth transitions
- Controlled and uncontrolled state support
- Compound component structure (Root, Trigger, Content)
- `hidden="until-found"` support for browser search integration

## Architecture
Three sub-components:
- **Root**: Parent container managing state and context
- **Trigger**: Interactive element toggling expanded/collapsed state
- **Content**: Container for shown/hidden content

## Basic Structure
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
</script>
<Collapsible.Root class="w-[327px] space-y-3">
  <div class="flex items-center justify-between space-x-10">
    <h4 class="text-[15px] font-medium">@huntabyte starred 3 repositories</h4>
    <Collapsible.Trigger
      class="rounded-9px border-border-input bg-background-alt text-foreground shadow-btn hover:bg-muted inline-flex h-10 w-10 items-center justify-center border transition-all active:scale-[0.98]"
      aria-label="Show starred repositories"
    >
      <CaretUpDown class="size-4" weight="bold" />
    </Collapsible.Trigger>
  </div>
  <Collapsible.Content
    hiddenUntilFound
    class="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up space-y-2 overflow-hidden font-mono text-[15px] tracking-[0.01em]"
  >
    <div class="rounded-9px bg-muted inline-flex h-12 w-full items-center px-[18px] py-3">
      @huntabyte/bits-ui
    </div>
    <div class="rounded-9px bg-muted inline-flex h-12 w-full items-center px-[18px] py-3">
      @huntabyte/shadcn-svelte
    </div>
    <div class="rounded-9px bg-muted inline-flex h-12 w-full items-center px-[18px] py-3">
      @svecosystem/runed
    </div>
  </Collapsible.Content>
</Collapsible.Root>
```

## Reusable Component Pattern
```svelte
<script lang="ts">
  import { Collapsible, type WithoutChild } from "bits-ui";
  type Props = WithoutChild<Collapsible.RootProps> & {
    buttonText: string;
  };
  let {
    open = $bindable(false),
    ref = $bindable(null),
    buttonText,
    children,
    ...restProps
  }: Props = $props();
</script>
<Collapsible.Root bind:open bind:ref {...restProps}>
  <Collapsible.Trigger>{buttonText}</Collapsible.Trigger>
  <Collapsible.Content>
    {@render children?.()}
  </Collapsible.Content>
</Collapsible.Root>
```

Usage:
```svelte
<MyCollapsible buttonText="Open Collapsible">
  Here is my collapsible content.
</MyCollapsible>
```

## State Management

### Two-Way Binding
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open Collapsible</button>
<Collapsible.Root bind:open={isOpen}>
  <!-- ... -->
</Collapsible.Root>
```

### Fully Controlled (Function Binding)
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  let myOpen = $state(false);
  function getOpen() {
    return myOpen;
  }
  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>
<Collapsible.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</Collapsible.Root>
```

## Svelte Transitions

### Using `forceMount` and `child` Snippets
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  import { fade } from "svelte/transition";
</script>
<Collapsible.Root>
  <Collapsible.Trigger>Open</Collapsible.Trigger>
  <Collapsible.Content forceMount>
    {#snippet child({ props, open })}
      {#if open}
        <div {...props} transition:fade>
          <!-- ... -->
        </div>
      {/if}
    {/snippet}
  </Collapsible.Content>
</Collapsible.Root>
```

- `forceMount` ensures content always in DOM
- `child` snippet provides access to open state and props
- `#if` block controls visibility
- Transition directive applies animations

### Reusable Transition Component
```svelte
<script lang="ts">
  import { Collapsible, type WithoutChildrenOrChild } from "bits-ui";
  import { fade } from "svelte/transition";
  import type { Snippet } from "svelte";
  let {
    ref = $bindable(null),
    duration = 200,
    children,
    ...restProps
  }: WithoutChildrenOrChild<Collapsible.ContentProps> & {
    duration?: number;
    children?: Snippet;
  } = $props();
</script>
<Collapsible.Content forceMount bind:ref {...restProps}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Collapsible.Content>
```

Usage:
```svelte
<Collapsible.Root>
  <Collapsible.Trigger>Open</Collapsible.Trigger>
  <MyCollapsibleContent duration={300}>
    <!-- ... -->
  </MyCollapsibleContent>
</Collapsible.Root>
```

## Hidden Until Found
The `hiddenUntilFound` prop enables browser find-in-page integration. When enabled, content is marked with `hidden="until-found"`, allowing browsers to automatically expand collapsed content when users search for text.

```svelte
<Collapsible.Root>
  <Collapsible.Trigger>Show More Details</Collapsible.Trigger>
  <Collapsible.Content hiddenUntilFound={true}>
    <p>
      This content will be automatically revealed when users search for text
      within it using Ctrl+F (Cmd+F on Mac).
    </p>
  </Collapsible.Content>
</Collapsible.Root>
```

## API Reference

### Collapsible.Root
| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `open` $bindable | `boolean` | Open state; content visible when true | `false` |
| `onOpenChange` | `(open: boolean) => void` | Callback when open state changes | `undefined` |
| `onOpenChangeComplete` | `(open: boolean) => void` | Callback after state change and animations complete | `undefined` |
| `disabled` | `boolean` | Prevents user interaction | `false` |
| `ref` $bindable | `HTMLDivElement` | DOM element reference | `null` |
| `children` | `Snippet` | Children content | `undefined` |
| `child` | `Snippet` | Render delegation snippet | `undefined` |

Data Attributes:
- `data-state`: `'open'` \| `'closed'`
- `data-disabled`: Present when disabled
- `data-collapsible-root`: Present on root

### Collapsible.Trigger
| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `ref` $bindable | `HTMLButtonElement` | DOM element reference | `null` |
| `children` | `Snippet` | Children content | `undefined` |
| `child` | `Snippet` | Render delegation snippet | `undefined` |

Data Attributes:
- `data-state`: `'open'` \| `'closed'`
- `data-disabled`: Present when disabled
- `data-collapsible-trigger`: Present on trigger

### Collapsible.Content
| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `forceMount` | `boolean` | Force mount for transitions/animations | `false` |
| `hiddenUntilFound` | `boolean` | Mark with `hidden="until-found"` for search integration | `false` |
| `ref` $bindable | `HTMLDivElement` | DOM element reference | `null` |
| `children` | `Snippet` | Children content | `undefined` |
| `child` | `Snippet` - `{ open: boolean; props: Record<string, unknown> }` | Render delegation snippet | `undefined` |

Data Attributes:
- `data-state`: `'open'` \| `'closed'`
- `data-disabled`: Present when disabled
- `data-collapsible-content`: Present on content

CSS Variables:
- `--bits-collapsible-content-height`: Height of content element
- `--bits-collapsible-content-width`: Width of content element