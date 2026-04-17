## Installation
```bash
npm install bits-ui
```

## Basic Usage
Import and use components in Svelte files:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>This is the collapsible content for this section.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Item 2 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>This is the collapsible content for this section.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Styling
Bits UI components are headless with minimal styling. Use `class` and `style` props to apply styles.

### TailwindCSS/UnoCSS
Pass utility classes directly to components:
```svelte
<Accordion.Root class="mx-auto w-full max-w-md">
  <Accordion.Item class="mb-2 rounded-md border border-gray-200">
    <Accordion.Header class="bg-gray-50 transition-colors hover:bg-gray-100">
      <Accordion.Trigger class="flex w-full items-center justify-between p-4 text-left font-medium">
        <span>Tailwind-styled Accordion</span>
        <svg class="h-5 w-5 transform transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content class="p-4 text-gray-700">This accordion is styled using Tailwind CSS classes.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Data Attributes
Components apply data attributes to HTML elements for CSS targeting. Check API Reference for each component's data attributes, then use in global styles:
```css
[data-button-root] {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: white;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
}
[data-button-root]:hover {
  background-color: #2c5282;
}
```

## TypeScript Support
Full type definitions and autocompletion provided:
```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  const accordionMultipleProps: Accordion.RootProps = {
    type: "multiple",
    value: ["item-1"], // type error if value is not an array
  };
  const accordionSingleProps: Accordion.RootProps = {
    type: "single",
    value: "item-1", // type error if value is an array
  };
</script>
```

## Next Steps
- Explore Component Documentation for all available components
- Learn about render delegation using Child Snippet for maximum flexibility
- Learn about State Management and taking more control over components

## Resources
- Open issues on GitHub for confirmed bugs
- Join Discord community or open GitHub discussions for questions
- Open GitHub discussions in feature-requests-ideas category for feature requests