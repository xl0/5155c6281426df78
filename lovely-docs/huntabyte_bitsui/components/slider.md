## Slider Component

Enables users to select a value from a continuous range. Supports single or multiple thumbs, vertical/horizontal orientation, discrete steps, and RTL.

### Basic Usage

```svelte
<script lang="ts">
  import { Slider } from "bits-ui";
  let value = $state(50);
</script>

<Slider.Root type="single" bind:value>
  <span class="track">
    <Slider.Range />
  </span>
  <Slider.Thumb index={0} />
</Slider.Root>
```

### Structure
- `Slider.Root` - container
- `Slider.Range` - filled portion of track
- `Slider.Thumb` - draggable handle
- `Slider.Tick` - tick marks
- `Slider.TickLabel` - labels for ticks
- `Slider.ThumbLabel` - labels for thumbs

### State Management

**Two-way binding:**
```svelte
let myValue = $state(0);
<Slider.Root bind:value={myValue} type="single" />
```

**Fully controlled with function binding:**
```svelte
let myValue = $state(0);
<Slider.Root type="single" bind:value={() => myValue, (v) => myValue = v} />
```

### Callbacks
- `onValueChange` - fires continuously while dragging
- `onValueCommit` - fires when user stops dragging

### Types

**Single thumb:**
```svelte
<Slider.Root type="single" bind:value={50} />
```

**Multiple thumbs:**
```svelte
<Slider.Root type="multiple" bind:value={[25, 75]}>
  {#snippet children({ thumbItems })}
    {#each thumbItems as { index } (index)}
      <Slider.Thumb {index} />
    {/each}
  {/snippet}
</Slider.Root>
```

### Orientation

```svelte
<Slider.Root type="single" orientation="vertical">
  <!-- vertical slider -->
</Slider.Root>
```

### Steps

**Continuous step:**
```svelte
<Slider.Root type="single" step={1} min={0} max={10} />
```

**Discrete steps (snap to values):**
```svelte
<Slider.Root type="single" step={[0, 4, 8, 16, 24]} />
```

### Ticks and Labels

```svelte
<Slider.Root type="single" step={1} min={0} max={10}>
  {#snippet children({ tickItems })}
    {#each tickItems as { index, value } (index)}
      <Slider.Tick {index} />
      <Slider.TickLabel {index} position="top">{value}</Slider.TickLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

### Thumb Labels

```svelte
<Slider.Root type="multiple" value={[10, 50]}>
  <Slider.Range />
  {#snippet children({ thumbItems })}
    {#each thumbItems as { index, value } (index)}
      <Slider.Thumb {index} />
      <Slider.ThumbLabel {index} position="top">
        {index === 0 ? "Min" : "Max"}: {value}
      </Slider.ThumbLabel>
    {/each}
  {/snippet}
</Slider.Root>
```

### Reusable Component

```svelte
<!-- MySlider.svelte -->
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Slider } from "bits-ui";
  type Props = WithoutChildren<ComponentProps<typeof Slider.Root>>;
  let { value = $bindable(), ref = $bindable(null), ...restProps }: Props = $props();
</script>

<Slider.Root bind:value bind:ref {...restProps as any}>
  {#snippet children({ thumbs, ticks })}
    <Slider.Range />
    {#each thumbs as index}
      <Slider.Thumb {index} />
    {/each}
    {#each ticks as index}
      <Slider.Tick {index} />
    {/each}
  {/snippet}
</Slider.Root>
```

### HTML Forms

Since slider values are continuous, render hidden inputs manually:

```svelte
<form method="POST">
  <MySlider type="multiple" bind:value={[50, 100]} />
  <input type="hidden" name="start" value={value[0]} />
  <input type="hidden" name="end" value={value[1]} />
  <button type="submit">Submit</button>
</form>
```

### Configuration

- `type` (required) - 'single' | 'multiple'
- `value` - current value(s), bindable
- `min` - minimum value (default: 0)
- `max` - maximum value (default: 100)
- `step` - number or array of numbers for discrete steps
- `orientation` - 'horizontal' | 'vertical' (default: 'horizontal')
- `dir` - 'ltr' | 'rtl' (default: 'ltr')
- `disabled` - disable interaction
- `autoSort` - auto-sort values when thumbs cross (default: true, multiple only)
- `thumbPositioning` - 'exact' | 'contain' (default: 'contain')
- `trackPadding` - percentage padding at track edges (SSR-friendly alternative to thumbPositioning)

### Data Attributes

**Slider.Root:** `data-orientation`, `data-disabled`, `data-slider-root`

**Slider.Range:** `data-orientation`, `data-disabled`, `data-slider-range`

**Slider.Thumb:** `data-orientation`, `data-disabled`, `data-active`, `data-slider-thumb`

**Slider.Tick:** `data-orientation`, `data-disabled`, `data-bounded`, `data-value`, `data-selected`, `data-slider-tick`

**Slider.TickLabel:** `data-orientation`, `data-disabled`, `data-position`, `data-selected`, `data-value`, `data-bounded`, `data-slider-tick-label`

**Slider.ThumbLabel:** `data-orientation`, `data-disabled`, `data-position`, `data-active`, `data-value`, `data-slider-thumb-label`