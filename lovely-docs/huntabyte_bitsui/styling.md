## Styling Approaches

Bits UI ships with zero styles by default. All components that render HTML elements expose `class` and `style` props.

**CSS Frameworks**: Pass framework classes directly to components:
```svelte
<Accordion.Trigger class="h-12 w-full bg-blue-500 hover:bg-blue-600">Click me</Accordion.Trigger>
```

**Data Attributes**: Each component applies data attributes for reliable CSS selectors. Target them in global stylesheets:
```css
[data-accordion-trigger] {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: #fff;
}
```
Import stylesheet in layout component.

**Global Classes**: Define CSS classes and apply via `class` prop:
```css
.accordion-trigger {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: #fff;
}
```
```svelte
<Accordion.Trigger class="accordion-trigger">Click me</Accordion.Trigger>
```

**Scoped Styles**: Use the `child` snippet to bring elements into component scope for Svelte scoped styles:
```svelte
<Accordion.Trigger>
  {#snippet child({ props })}
    <button {...props} class="my-accordion-trigger">Click me!</button>
  {/snippet}
</Accordion.Trigger>
<style>
  .my-accordion-trigger {
    height: 3rem;
    width: 100%;
    background-color: #3182ce;
    color: #fff;
  }
</style>
```

**Style Prop**: Accept string or object, merged with internal styles via `mergeProps`:
```svelte
<Accordion.Trigger style="background-color: #3182ce; color: white; padding: 1rem;">
  Click me
</Accordion.Trigger>
<!-- Or object -->
<Accordion.Trigger style={{ backgroundColor: "#3182ce", color: "white", padding: "1rem" }}>
  Click me
</Accordion.Trigger>
```

## Styling Component States

**State Data Attributes**: Components expose state via data attributes:
```css
[data-accordion-trigger][data-state="open"] {
  background-color: #f0f0f0;
  font-weight: bold;
}
[data-accordion-trigger][data-state="closed"] {
  background-color: #ffffff;
}
[data-accordion-trigger][data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**CSS Variables**: Components expose CSS variables for internal values. Example: `--bits-select-anchor-width` for Select.Content width:
```css
[data-select-content] {
  width: var(--bits-select-anchor-width);
  min-width: var(--bits-select-anchor-width);
  max-width: var(--bits-select-anchor-width);
}
```

**Example Accordion with States**:
```svelte
<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger disabled>Section 2 (Disabled)</Accordion.Trigger>
    <Accordion.Content>Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
<style>
  :global([data-accordion-item]) {
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }
  :global([data-accordion-trigger]) {
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  :global([data-accordion-trigger][data-state="open"]) {
    background-color: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  :global([data-accordion-trigger][data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :global([data-accordion-content]) {
    padding: 1rem;
  }
</style>
```

## Advanced Styling Techniques

**Combining Data Attributes with CSS Variables**: Animate accordion content using `--bits-accordion-content-height` and `data-state`:
```css
[data-accordion-content] {
  overflow: hidden;
  transition: height 300ms ease-out;
  height: 0;
}
[data-accordion-content][data-state="open"] {
  height: var(--bits-accordion-content-height);
}
[data-accordion-content][data-state="closed"] {
  height: 0;
}
```

**Custom Keyframe Animations**:
```css
@keyframes accordionOpen {
  0% {
    height: 0;
    opacity: 0;
  }
  80% {
    height: var(--bits-accordion-content-height);
    opacity: 0.8;
  }
  100% {
    height: var(--bits-accordion-content-height);
    opacity: 1;
  }
}
@keyframes accordionClose {
  0% {
    height: var(--bits-accordion-content-height);
    opacity: 1;
  }
  20% {
    height: var(--bits-accordion-content-height);
    opacity: 0.8;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}
[data-accordion-content][data-state="open"] {
  animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
[data-accordion-content][data-state="closed"] {
  animation: accordionClose 300ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
}
```

**Animated Accordion Example**:
```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
<style>
  :global([data-accordion-item]) {
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }
  :global([data-accordion-trigger]) {
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  :global([data-accordion-trigger][data-state="open"]) {
    background-color: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  :global([data-accordion-content]) {
    overflow: hidden;
    transition: height 300ms ease-out;
  }
  @keyframes -global-accordionOpen {
    0% { height: 0; opacity: 0; }
    80% { height: var(--bits-accordion-content-height); opacity: 0.8; }
    100% { height: var(--bits-accordion-content-height); opacity: 1; }
  }
  @keyframes -global-accordionClose {
    0% { height: var(--bits-accordion-content-height); opacity: 1; }
    20% { height: var(--bits-accordion-content-height); opacity: 0.8; }
    100% { height: 0; opacity: 0; }
  }
  :global([data-accordion-content][data-state="open"]) {
    animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  :global([data-accordion-content][data-state="closed"]) {
    animation: accordionClose 300ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
  }
</style>
```