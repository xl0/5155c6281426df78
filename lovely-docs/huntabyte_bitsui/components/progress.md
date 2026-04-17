## Progress Component

Shows the completion status of a task. Value only increases as task progresses.

### Distinction from Meter
- **Progress**: Shows completion status of a task, value only increases. Examples: file upload, installation, form completion.
- **Meter**: Displays static measurement within known range, value can fluctuate. Examples: CPU usage, battery level, volume.

### Basic Usage

```svelte
<script lang="ts">
  import { Progress } from "bits-ui";
  import { onMount } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  
  const tween = new Tween(13, { duration: 1000, easing: cubicInOut });
  const labelId = $props.id();
  
  onMount(() => {
    const timer = setTimeout(() => tween.set(66), 500);
    return () => clearTimeout(timer);
  });
</script>

<div class="flex w-[60%] flex-col gap-2">
  <div class="flex items-center justify-between text-sm font-medium">
    <span id={labelId}>Uploading file...</span>
    <span>{Math.round(tween.current)}%</span>
  </div>
  <Progress.Root
    aria-labelledby={labelId}
    value={Math.round(tween.current)}
    max={100}
    class="bg-dark-10 shadow-mini-inset relative h-[15px] w-full overflow-hidden rounded-full"
  >
    <div
      class="bg-foreground shadow-mini-inset h-full w-full flex-1 rounded-full"
      style={`transform: translateX(-${100 - (100 * (tween.current ?? 0)) / 100}%)`}
    ></div>
  </Progress.Root>
</div>
```

### Reusable Component Pattern

```svelte
<script lang="ts">
  import { Progress, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";
  
  let {
    max = 100,
    value = 0,
    min = 0,
    label,
    valueLabel,
  }: ComponentProps<typeof Progress.Root> & {
    label: string;
    valueLabel: string;
  } = $props();
  
  const labelId = useId();
</script>

<div>
  <span id={labelId}>{label}</span>
  <span>{valueLabel}</span>
</div>
<Progress.Root
  aria-labelledby={labelId}
  aria-valuetext={valueLabel}
  {value}
  {min}
  {max}
/>
```

Usage:
```svelte
<script lang="ts">
  import MyProgress from "$lib/components/MyProgress.svelte";
  let value = $state(50);
</script>

<MyProgress label="Loading images..." valueLabel="{value}%" {value} />
```

### Accessibility

Use `aria-labelledby` prop with ID of visual label, or `aria-label` prop for text description when no visual label is present.

### API Reference

**Progress.Root** properties:
- `max` (number, default: 100): Maximum value
- `min` (number, default: 0): Minimum value
- `value` (number | null, default: 0): Current value; `null` makes it indeterminate
- `ref` ($bindable HTMLDivElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation for custom elements

**Data attributes**:
- `data-value`: Current value
- `data-state`: 'indeterminate' | 'determinate'
- `data-min`: Minimum value
- `data-max`: Maximum value
- `data-indeterminate`: Present when value is null
- `data-progress-root`: Present on root element