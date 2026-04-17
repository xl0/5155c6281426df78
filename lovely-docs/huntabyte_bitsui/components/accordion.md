## Accordion Component

Organizes content into collapsible sections. Supports single or multiple open items simultaneously.

### Structure
- `Accordion.Root`: Container managing overall state
- `Accordion.Item`: Individual collapsible section
- `Accordion.Header`: Contains visible heading
- `Accordion.Trigger`: Clickable element toggling visibility
- `Accordion.Content`: Collapsible body content

### Basic Usage
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Collapsible content</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Item 2 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Collapsible content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Key Features
- **Single or Multiple Mode**: `type="single"` allows one open section; `type="multiple"` allows multiple
- **Accessible**: Built-in ARIA attributes and keyboard navigation
- **Smooth Transitions**: CSS variables or Svelte transitions support
- **Flexible State**: Uncontrolled defaults or full control with bound values
- **Disabled Items**: Set `disabled` prop on items
- **Hidden Until Found**: `hiddenUntilFound` prop enables browser search within collapsed content
- **Horizontal Orientation**: `orientation="horizontal"` for horizontal layouts

### State Management

Two-way binding:
```svelte
<script lang="ts">
  let myValue = $state<string[]>([]);
</script>
<Accordion.Root type="multiple" bind:value={myValue}>
  <!-- items -->
</Accordion.Root>
```

Fully controlled with function binding:
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<Accordion.Root type="single" bind:value={getValue, setValue}>
  <!-- items -->
</Accordion.Root>
```

### Reusable Components

Item wrapper combining Item, Header, Trigger, and Content:
```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  type Props = WithoutChildrenOrChild<Accordion.ItemProps> & {
    title: string;
    content: string;
  };
  let { title, content, ...restProps }: Props = $props();
</script>
<Accordion.Item {...restProps}>
  <Accordion.Header>
    <Accordion.Trigger>{title}</Accordion.Trigger>
  </Accordion.Header>
  <Accordion.Content>{content}</Accordion.Content>
</Accordion.Item>
```

Root wrapper rendering multiple items:
```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  import MyAccordionItem from "$lib/components/MyAccordionItem.svelte";
  type Item = { value?: string; title: string; content: string; disabled?: boolean; };
  let { value = $bindable(), ref = $bindable(null), items, ...restProps }: WithoutChildrenOrChild<Accordion.RootProps> & { items: Item[]; } = $props();
</script>
<Accordion.Root bind:value bind:ref {...restProps as any}>
  {#each items as item, i (item.title + i)}
    <MyAccordionItem {...item} />
  {/each}
</Accordion.Root>
```

Usage:
```svelte
<script lang="ts">
  import MyAccordion from "$lib/components/MyAccordion.svelte";
  const items = [
    { title: "Item 1", content: "Content 1" },
    { title: "Item 2", content: "Content 2" },
  ];
</script>
<MyAccordion type="single" {items} />
```

### Svelte Transitions

Using `forceMount` and `child` snippet:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  import { slide } from "svelte/transition";
</script>
<Accordion.Content forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:slide={{ duration: 1000 }}>
        Content with transition
      </div>
    {/if}
  {/snippet}
</Accordion.Content>
```

Reusable transition wrapper:
```svelte
<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  let { ref = $bindable(null), duration = 200, children, ...restProps }: WithoutChildrenOrChild<Accordion.ContentProps> & { duration?: number; children: Snippet; } = $props();
</script>
<Accordion.Content forceMount bind:ref {...restProps}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Accordion.Content>
```

### Examples

**Horizontal Cards** with image backgrounds and descriptions:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  let value = $state("item-1");
  const items = [
    { id: "item-1", title: "Mountain Range", image: "...", description: "..." },
    { id: "item-2", title: "Ocean Views", image: "...", description: "..." },
    { id: "item-3", title: "Forest Retreats", image: "...", description: "..." }
  ];
</script>
<Accordion.Root type="single" orientation="horizontal" class="flex h-[400px] w-full gap-2" bind:value>
  {#each items as item (item.id)}
    <Accordion.Item value={item.id} class="relative cursor-pointer overflow-hidden rounded-lg transition-all duration-500 data-[state=closed]:w-[20%] data-[state=open]:w-[100%]" onclick={() => (value = item.id)}>
      <img src={item.image} alt={item.title} class="h-[400px] w-full object-cover" />
      <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4">
        <Accordion.Header>
          <Accordion.Trigger class="text-left font-bold text-white data-[state=open]:mb-2 data-[state=closed]:text-sm data-[state=open]:text-base">
            {item.title}
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content forceMount class="max-h-0 overflow-hidden text-white/90 transition-all data-[state=open]:max-h-[100px]">
          {item.description}
        </Accordion.Content>
      </div>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

**Checkout Steps** with multi-step form:
```svelte
<script lang="ts">
  import { Accordion, Button } from "bits-ui";
  let activeStep = $state("");
  let completedSteps = new SvelteSet<string>();
</script>
<Accordion.Root bind:value={activeStep} type="single">
  <Accordion.Item value="1">
    <Accordion.Header>
      <Accordion.Trigger>Shipping Information</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <div class="flex flex-col gap-4 pb-6">
        <input placeholder="First Name" />
        <input placeholder="Last Name" />
        <input placeholder="Address" />
        <Button.Root onclick={() => { completedSteps.add("1"); activeStep = "2"; }}>
          Continue to Payment
        </Button.Root>
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="2">
    <Accordion.Header>
      <Accordion.Trigger>Payment Method</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <div class="flex flex-col gap-4 pb-6">
        <input placeholder="Card Number" />
        <input placeholder="Exp. Month" />
        <input placeholder="Exp. Year" />
        <input placeholder="CVC" />
        <Button.Root onclick={() => { completedSteps.add("2"); activeStep = "3"; }}>
          Continue to Review
        </Button.Root>
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="3">
    <Accordion.Header>
      <Accordion.Trigger>Review Order</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      <div class="rounded-lg border p-4">
        <h4 class="mb-2 font-medium">Order Summary</h4>
        <div class="flex justify-between">Product 1: $29.99</div>
        <div class="flex justify-between">Product 2: $49.99</div>
        <div class="flex justify-between">Shipping: $4.99</div>
        <div class="mt-2 flex justify-between border-t pt-2 font-medium">Total: $84.97</div>
        <Button.Root onclick={() => { completedSteps.add("3"); activeStep = ""; }}>
          Place Order
        </Button.Root>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### API Reference

**Accordion.Root**
- `type` (required): 'single' | 'multiple'
- `value` ($bindable): string[] | string - currently active item(s)
- `onValueChange`: callback when value changes
- `disabled`: boolean (default: false)
- `loop`: boolean - loop through items (default: false)
- `orientation`: 'vertical' | 'horizontal' (default: 'vertical')
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props

Data attributes: `data-orientation`, `data-disabled`, `data-accordion-root`

**Accordion.Item**
- `disabled`: boolean (default: false)
- `value`: string - unique identifier (auto-generated if not provided)
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props

Data attributes: `data-state` ('open' | 'closed'), `data-disabled`, `data-orientation`, `data-accordion-item`

**Accordion.Header**
- `level`: 1 | 2 | 3 | 4 | 5 | 6 - heading level (default: 3)
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props

Data attributes: `data-orientation`, `data-disabled`, `data-heading-level`, `data-accordion-header`

**Accordion.Trigger**
- `ref` ($bindable): HTMLButtonElement
- `children`: Snippet
- `child`: Snippet with props

Data attributes: `data-orientation`, `data-disabled`, `data-accordion-trigger`

**Accordion.Content**
- `forceMount`: boolean - always mount in DOM (default: false)
- `hiddenUntilFound`: boolean - use `hidden="until-found"` for browser search (default: false)
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet
- `child`: Snippet with props and `open` state

Data attributes: `data-orientation`, `data-disabled`, `data-accordion-content`
CSS variables: `--bits-accordion-content-height`, `--bits-accordion-content-width`