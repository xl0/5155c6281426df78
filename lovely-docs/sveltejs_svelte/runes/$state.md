## Overview
The `$state` rune creates reactive state that automatically updates the UI when changed. Unlike other frameworks, state is just a regular value (number, object, etc.) that you update normally.

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

## Deep State (Proxies)
Arrays and plain objects become deeply reactive proxies. Svelte recursively proxifies until it encounters non-plain objects (classes, Object.create results). Modifying nested properties triggers granular updates:

```js
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
todos.push({ done: false, text: 'eat lunch' }); // new objects are also proxified
```

Destructuring breaks reactivity since values are evaluated at destructuring time:
```js
let { done, text } = todos[0];
todos[0].done = !todos[0].done; // doesn't update `done`
```

## Classes
Class instances are not proxied. Use `$state` on class fields or in constructor assignments:

```js
class Todo {
	done = $state(false);
	constructor(text) {
		this.text = $state(text);
	}
	reset() {
		this.text = '';
		this.done = false;
	}
}
```

The compiler transforms these into get/set methods on private fields (not enumerable). When using methods in event handlers, `this` context matters:

```svelte
<button onclick={todo.reset}>reset</button> <!-- WRONG: this is the button -->
<button onclick={() => todo.reset()}>reset</button> <!-- CORRECT -->
```

Or use arrow functions in the class:
```js
reset = () => { this.text = ''; this.done = false; }
```

Svelte provides reactive built-in classes (Set, Map, Date, URL) from `svelte/reactivity`.

## `$state.raw`
Non-reactive state that can only be reassigned, not mutated. Improves performance for large objects/arrays you don't plan to mutate:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });
person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

Raw state can contain reactive state (e.g., raw array of reactive objects).

## `$state.snapshot`
Takes a static snapshot of a deeply reactive proxy, useful for passing to external libraries that don't expect proxies:

```js
let counter = $state({ count: 0 });
console.log($state.snapshot(counter)); // { count: ... } not Proxy
```

## `$state.eager`
Updates UI immediately when state changes, even in `await` expressions. Use sparingly for user feedback:

```svelte
<nav>
	<a href="/" aria-current={$state.eager(pathname) === '/' ? 'page' : null}>home</a>
</nav>
```

## Passing State to Functions
JavaScript is pass-by-value. When you pass state to a function, you pass its current value, not a reference that updates:

```js
function add(a, b) { return a + b; }
let a = $state(1), b = $state(2);
let total = add(a, b); // total = 3, doesn't update when a/b change
```

To get current values, use functions/getters:
```js
function add(getA, getB) { return () => getA() + getB(); }
let total = add(() => a, () => b);
console.log(total()); // 3, then 7 after a=3, b=4
```

Proxies and get/set properties also work:
```js
function add(input) {
	return { get value() { return input.a + input.b; } };
}
let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3, then 7 after input changes
```

## Passing State Across Modules
State can only be exported if not directly reassigned. The compiler transforms `$state` references into get/set calls, but this only works within a single file:

```js
// state.svelte.js - WRONG
export let count = $state(0);
export function increment() { count += 1; } // compiler transforms this
```

When imported elsewhere, `count` is an object, not a number. Two solutions:

1. Update properties instead of reassigning:
```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

2. Don't directly export state:
```js
let count = $state(0);
export function getCount() { return count; }
export function increment() { count += 1; }
```