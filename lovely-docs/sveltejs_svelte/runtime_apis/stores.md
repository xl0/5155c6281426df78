## Stores

A store is an object providing reactive access to a value via a simple contract. The `svelte/store` module provides minimal implementations.

### Accessing stores in components

Use the `$` prefix to access store values reactively. Svelte automatically subscribes at initialization and unsubscribes when appropriate. The store must be declared at component top level (not in conditionals or functions).

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	console.log($count); // 0
	count.set(1);
	console.log($count); // 1
	$count = 2; // requires writable store
	console.log($count); // 2
</script>
```

Assignments to `$`-prefixed variables call the store's `.set` method and require a writable store.

### When to use stores

Prior to Svelte 5, stores were the primary solution for cross-component state and logic extraction. With runes, these use cases have diminished:

- **Logic extraction**: Use runes' universal reactivity instead. Runes work outside component top level and in `.svelte.js`/`.svelte.ts` files.
- **Shared state**: Create a `$state` object in a `.svelte.js` file:

```ts
// state.svelte.js
export const userState = $state({ name: 'name' });
```

```svelte
// App.svelte
<script>
	import { userState } from './state.svelte.js';
</script>
<p>User name: {userState.name}</p>
<button onclick={() => { userState.name = 'new name'; }}>change name</button>
```

Stores remain useful for complex asynchronous data streams, manual control over updates/listeners, or RxJS knowledge reuse.

### writable

Creates a store with externally settable values. Includes `set(value)` and `update(callback)` methods.

```js
import { writable } from 'svelte/store';
const count = writable(0);
count.subscribe((value) => console.log(value)); // logs 0
count.set(1); // logs 1
count.update((n) => n + 1); // logs 2
```

Optional second argument is a function called when subscriber count goes 0→1. It receives `set` and `update` functions and must return a `stop` function called when count goes 1→0:

```js
const count = writable(0, () => {
	console.log('got a subscriber');
	return () => console.log('no more subscribers');
});
count.set(1); // does nothing
const unsubscribe = count.subscribe((value) => console.log(value)); // logs 'got a subscriber', then '1'
unsubscribe(); // logs 'no more subscribers'
```

Store values are lost on page refresh; implement custom logic to sync to localStorage if needed.

### readable

Creates a store whose value cannot be set externally. First argument is initial value; second argument works like writable's second argument.

```ts
import { readable } from 'svelte/store';
const time = readable(new Date(), (set) => {
	set(new Date());
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});

const ticktock = readable('tick', (set, update) => {
	const interval = setInterval(() => {
		update((sound) => (sound === 'tick' ? 'tock' : 'tick'));
	}, 1000);
	return () => clearInterval(interval);
});
```

### derived

Derives a store from one or more other stores. Callback runs when first subscriber subscribes and whenever dependencies change.

Simple version with single store:

```ts
import { derived } from 'svelte/store';
const doubled = derived(a, ($a) => $a * 2);
```

Callback can set values asynchronously via second argument `set` and optional third argument `update`. Pass initial value as third argument to `derived`:

```ts
const delayed = derived(
	a,
	($a, set) => {
		setTimeout(() => set($a), 1000);
	},
	2000 // initial value
);

const delayedIncrement = derived(a, ($a, set, update) => {
	set($a);
	setTimeout(() => update((x) => x + 1), 1000);
});
```

Return a function from callback to clean up when callback runs again or last subscriber unsubscribes:

```ts
const tick = derived(
	frequency,
	($frequency, set) => {
		const interval = setInterval(() => set(Date.now()), 1000 / $frequency);
		return () => clearInterval(interval);
	},
	2000
);
```

Pass array of stores as first argument to derive from multiple:

```ts
const summed = derived([a, b], ([$a, $b]) => $a + $b);
const delayed = derived([a, b], ([$a, $b], set) => {
	setTimeout(() => set($a + $b), 1000);
});
```

### readonly

Makes a store readonly. Subscriptions to the original still work through the readonly wrapper:

```js
import { readonly, writable } from 'svelte/store';
const writableStore = writable(1);
const readableStore = readonly(writableStore);
readableStore.subscribe(console.log);
writableStore.set(2); // console: 2
readableStore.set(2); // ERROR
```

### get

Retrieves a store's value without subscribing. Creates a subscription, reads the value, then unsubscribes. Not recommended in hot code paths.

```ts
import { get } from 'svelte/store';
const value = get(store);
```

## Store contract

Implement the store contract to create custom stores:

```ts
store = { subscribe: (subscription: (value: any) => void) => (() => void), set?: (value: any) => void }
```

1. Must have `.subscribe(subscriptionFn)` that immediately and synchronously calls the subscription function with current value, then calls it whenever value changes.
2. `.subscribe` must return an unsubscribe function that stops the subscription.
3. May optionally have `.set(value)` that synchronously calls all active subscription functions (writable store).

For RxJS Observable interoperability, `.subscribe` can return an object with `.unsubscribe` method instead of a function. Note: Svelte sees the value as `undefined` until `.subscribe` synchronously calls the subscription.