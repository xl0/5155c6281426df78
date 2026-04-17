## Meter Component

Displays a static measurement within a known range. Unlike progress bars which show task completion, meters show current state relative to capacity (e.g., CPU usage, battery level, sound volume).

### Basic Usage

```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  let value = $state(2000);
  const labelId = useId();
  const max = 4000;
  const min = 0;
</script>

<Meter.Root
  aria-labelledby={labelId}
  aria-valuetext="{value} out of {max}"
  {value}
  {min}
  {max}
>
  <div style="transform: translateX(-{100 - (100 * value) / max}%)"></div>
</Meter.Root>
```

### Reusable Component Pattern

```svelte
<script lang="ts">
  import { Meter, useId } from "bits-ui";
  import type { ComponentProps } from "svelte";
  let {
    max = 100,
    value = 0,
    min = 0,
    label,
    valueLabel,
  }: ComponentProps<typeof Meter.Root> & {
    label: string;
    valueLabel: string;
  } = $props();
  const labelId = useId();
</script>

<div>
  <span id={labelId}>{label}</span>
  <span>{valueLabel}</span>
</div>
<Meter.Root
  aria-labelledby={labelId}
  aria-valuetext={valueLabel}
  {value}
  {min}
  {max}
/>
```

Usage: `<MyMeter label="Tokens used" valueLabel="{value} / {max}" {value} {max} />`

### Meter vs Progress Bar

- **Meter**: Static measurement within range, value fluctuates based on real-time state
- **Progress**: Completion status of task, value only increases

### Accessibility

- Use `aria-labelledby` if visual label exists, otherwise use `aria-label`
- Set `aria-valuetext` to make value understandable (e.g., "50% (6 hours) remaining")

### API Reference - Meter.Root

**Props:**
- `max` (number, default: 100): Maximum value
- `min` (number, default: 0): Minimum value
- `value` (number, default: 0): Current value
- `ref` (bindable HTMLDivElement): DOM element reference
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation for custom elements

**Data Attributes:**
- `data-value`: Current value
- `data-min`: Minimum value
- `data-max`: Maximum value
- `data-meter-root`: Present on root element