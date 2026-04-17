## State Management

Bits UI components support multiple approaches to manage component state. Each component's API reference highlights which props are `bindable`, and you can replace the `value` prop with any `bindable` prop.

### Two-Way Binding

Use Svelte's built-in two-way binding with `bind:`:

```svelte
import { ComponentName } from "bits-ui";
let myValue = $state("default-value");
```

```svelte
<button onclick={() => (myValue = "new-value")}> Update Value </button>
<ComponentName.Root bind:value={myValue}></ComponentName.Root>
```

**Why use it:**
- Zero-boilerplate state updates
- External controls work automatically
- Great for simple use cases

### Function Binding

Use a Function Binding for complete control with both getter and setter:

```svelte
let myValue = $state("default-value");
function getValue() {
  return myValue;
}
function setValue(newValue: string) {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 9 && hour <= 17) {
    myValue = newValue;
  }
}
```

```svelte
<ComponentName.Root bind:value={getValue, setValue}></ComponentName.Root>
```

When the component wants to set the value from an internal action, it invokes the setter, where you can determine if the setter actually updates the state or not.

**When to use:**
- Complex state transformation logic
- Conditional updates
- Debouncing or throttling state changes
- Maintaining additional state alongside the primary value
- Integrating with external state systems