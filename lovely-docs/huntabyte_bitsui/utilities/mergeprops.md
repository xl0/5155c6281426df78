## mergeProps

Utility function to merge multiple props objects. Used internally by Bits UI to merge custom `restProps` with component-provided props.

### Key Features
- Merges multiple props objects
- Chains event handlers with cancellation support
- Combines class names
- Merges style objects and strings
- Chains non-event handler functions

### Event Handlers

Event handlers are chained in order. If a handler calls `event.preventDefault()`, subsequent handlers are not executed.

```ts
const props1 = { onclick: (e: MouseEvent) => console.log("First click") };
const props2 = { onclick: (e: MouseEvent) => console.log("Second click") };
const mergedProps = mergeProps(props1, props2);
mergedProps.onclick(new MouseEvent("click")); // Logs: "First click" then "Second click"
```

With `preventDefault()`:

```ts
const props1 = { onclick: (e: MouseEvent) => console.log("First click") };
const props2 = {
  onclick: (e: MouseEvent) => {
    console.log("Second click");
    e.preventDefault();
  },
};
const props3 = { onclick: (e: MouseEvent) => console.log("Third click") };
const mergedProps = mergeProps(props1, props2, props3);
mergedProps.onclick(new MouseEvent("click")); // Logs: "First click" then "Second click" only
```

### Non-Event Handler Functions

Non-event handler functions are chained without cancellation ability:

```ts
const props1 = { doSomething: () => console.log("Action 1") };
const props2 = { doSomething: () => console.log("Action 2") };
const mergedProps = mergeProps(props1, props2);
mergedProps.doSomething(); // Logs: "Action 1" then "Action 2"
```

### Classes

Class names merged using clsx:

```ts
const props1 = { class: "text-lg font-bold" };
const props2 = { class: ["bg-blue-500", "hover:bg-blue-600"] };
const mergedProps = mergeProps(props1, props2);
console.log(mergedProps.class); // "text-lg font-bold bg-blue-500 hover:bg-blue-600"
```

### Styles

Style objects and strings merged, with later properties overriding earlier ones:

```ts
const props1 = { style: { color: "red", fontSize: "16px" } };
const props2 = { style: "background-color: blue; font-weight: bold;" };
const mergedProps = mergeProps(props1, props2);
console.log(mergedProps.style);
// "color: red; font-size: 16px; background-color: blue; font-weight: bold;"

const props1 = { style: "--foo: red" };
const props2 = { style: { "--foo": "green", color: "blue" } };
const mergedProps = mergeProps(props1, props2);
console.log(mergedProps.style); // "--foo: green; color: blue;"
```