## Rating Group

Enables users to provide ratings using customizable items (like stars).

### Basic Usage

```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
  import Star from "phosphor-svelte/lib/Star";
  let value = $state(3);
</script>
<RatingGroup.Root bind:value max={5} class="flex gap-1">
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        <Star class="size-full" weight="fill" />
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### Reusable Components

Create custom rating components:

```svelte
<script lang="ts">
  import { RatingGroup, type WithoutChildrenOrChild } from "bits-ui";
  import Star from "phosphor-svelte/lib/Star";
  import StarHalf from "phosphor-svelte/lib/StarHalf";
  let {
    value = $bindable(0),
    ref = $bindable(null),
    showLabel = true,
    max = 5,
    ...restProps
  }: WithoutChildrenOrChild<RatingGroup.RootProps> & {
    showLabel?: boolean;
  } = $props();
</script>
<div class="flex flex-col gap-2">
  <RatingGroup.Root bind:value bind:ref {max} {...restProps}>
    {#snippet children({ items })}
      {#each items as item (item.index)}
        <RatingGroup.Item index={item.index}>
          {#if item.state === "inactive"}
            <Star />
          {:else if item.state === "active"}
            <Star weight="fill" />
          {:else if item.state === "partial"}
            <StarHalf weight="fill" />
          {/if}
        </RatingGroup.Item>
      {/each}
    {/snippet}
  </RatingGroup.Root>
  {#if showLabel}
    <p class="text-muted-foreground text-sm">
      Rating: {value} out of {max} stars
    </p>
  {/if}
</div>
```

### State Management

Two-way binding:
```svelte
<script lang="ts">
  let myRating = $state(3);
</script>
<button onclick={() => (myRating = 5)}> Give 5 stars </button>
<RatingGroup.Root bind:value={myRating} max={5}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

Fully controlled with function binding:
```svelte
<script lang="ts">
  let myRating = $state(0);
  function getValue() {
    return myRating;
  }
  function setValue(newValue: number) {
    if (newValue >= 0 && newValue <= 5) {
      myRating = newValue;
    }
  }
</script>
<RatingGroup.Root bind:value={getValue, setValue} max={5}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### HTML Forms

Set `name` prop to render hidden input for form submission:
```svelte
<RatingGroup.Root name="productRating" max={5} required>
  <!-- ... -->
</RatingGroup.Root>
```

### Half Ratings

Enable with `allowHalf` prop:
```svelte
<RatingGroup.Root bind:value max={5} allowHalf={true} class="flex gap-1">
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "inactive"}
          <Star class="size-full" />
        {:else if item.state === "active"}
          <Star class="size-full fill-current" weight="fill" />
        {:else if item.state === "partial"}
          <StarHalf class="size-full fill-current" weight="fill" />
        {/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### Readonly Mode

```svelte
<RatingGroup.Root readonly value={4.5}>
  <!-- ... -->
</RatingGroup.Root>
```

### Disabled State

```svelte
<RatingGroup.Root disabled max={5}>
  <!-- ... -->
</RatingGroup.Root>
```

### Hover Preview

Disable with `hoverPreview={false}`:
```svelte
<RatingGroup.Root bind:value max={5} hoverPreview={false} class="flex gap-1">
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        <Star class="size-full group-data-[state=active]:fill-current" weight="fill" />
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### RTL Support

Set `dir="rtl"` on parent element. Arrow key navigation automatically reverses:
```svelte
<div dir="rtl">
  <RatingGroup.Root bind:value max={5} allowHalf class="flex gap-1">
    {#snippet children({ items })}
      {#each items as item (item.index)}
        <RatingGroup.Item index={item.index}>
          {#if item.state === "partial"}
            <StarHalf class="size-full fill-current rtl:scale-x-[-1]" weight="fill" />
          {:else if item.state === "active"}
            <Star class="size-full fill-current" weight="fill" />
          {:else}
            <Star class="size-full" />
          {/if}
        </RatingGroup.Item>
      {/each}
    {/snippet}
  </RatingGroup.Root>
</div>
```

### Min/Max Rating

```svelte
<RatingGroup.Root max={3}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {item.index + 1}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

```svelte
<RatingGroup.Root min={3} value={3}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

### Accessibility

Uses slider pattern with ARIA attributes: `role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, `aria-disabled`, `aria-required`, `aria-orientation`.

Keyboard navigation:
- **Direct number input**: Type `3` for 3 stars, `2.5` for half ratings (when `allowHalf` enabled), `0` to clear
- **Arrow keys**: Increment/decrement by 1 (or 0.5 in half-rating mode), reversed in RTL
- **Home/End**: Jump to min/max
- **PageUp/PageDown**: Increment/decrement by 1

Single tab stop - entire rating group is one focusable unit. Clicking focuses root slider.

Custom `aria-valuetext`:
```svelte
<RatingGroup.Root
  aria-valuetext={(value, max) => {
    if (value === 0) return "No rating selected";
    return `${value} out of ${max} stars. ${value >= 4 ? "Excellent" : value >= 3 ? "Good" : "Fair"} rating.`;
  }}
>
  <!-- ... -->
</RatingGroup.Root>
```

### API Reference

**RatingGroup.Root**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` $bindable | `number` | `0` | Rating value |
| `onValueChange` | `(value: number) => void` | — | Change callback |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Required for form |
| `name` | `string` | — | Form submission name (renders hidden input) |
| `min` | `number` | `0` | Minimum rating |
| `max` | `number` | `5` | Maximum rating |
| `allowHalf` | `boolean` | `false` | Allow 0.5 increments |
| `readonly` | `boolean` | `false` | Readonly mode |
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | Layout direction |
| `hoverPreview` | `boolean` | `false` | Show preview on hover |
| `aria-valuetext` | `string \| (value: number, max: number) => string` | `${value} out of ${max}` | ARIA description |
| `ref` $bindable | `HTMLDivElement` | `null` | DOM reference |
| `children` | `Snippet<{ items: RatingGroupItemData[]; value: number; max: number; }>` | — | Content |

Data attributes: `data-orientation`, `data-disabled`, `data-readonly`, `data-rating-group-root`

**RatingGroup.Item**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `index` required | `number` | — | Item index |
| `disabled` | `boolean` | `false` | Disable item |
| `ref` $bindable | `HTMLDivElement` | `null` | DOM reference |
| `children` | `Snippet<{ state: 'active' \| 'partial' \| 'inactive'; }>` | — | Content |

Data attributes: `data-disabled`, `data-readonly`, `data-value`, `data-state` ('checked' \| 'unchecked'), `data-orientation`, `data-rating-group-item`