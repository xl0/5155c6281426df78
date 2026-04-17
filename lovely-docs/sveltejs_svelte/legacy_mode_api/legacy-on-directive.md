## Event Handlers with `on:` Directive

In legacy mode, attach event handlers to elements using the `on:` directive:

```svelte
<script>
	let count = 0;
	function handleClick(event) {
		count += 1;
	}
</script>

<button on:click={handleClick}>count: {count}</button>
```

Handlers can be inline: `<button on:click={() => (count += 1)}>count: {count}</button>`

## Event Modifiers

Add modifiers with `|` character: `<form on:submit|preventDefault={handleSubmit}>`

Available modifiers:
- `preventDefault` — calls `event.preventDefault()`
- `stopPropagation` — calls `event.stopPropagation()`
- `stopImmediatePropagation` — calls `event.stopImmediatePropagation()`
- `passive` — improves scrolling performance on touch/wheel events
- `nonpassive` — explicitly set `passive: false`
- `capture` — fires during capture phase instead of bubbling
- `once` — remove handler after first run
- `self` — only trigger if `event.target` is the element itself
- `trusted` — only trigger if `event.isTrusted` is `true`

Modifiers chain: `on:click|once|capture={...}`

## Event Forwarding

Use `on:` without a value to forward events: `<button on:click>The component itself will emit the click event</button>`

## Multiple Listeners

Multiple handlers for same event are supported:

```svelte
<script>
	let count = 0;
	function increment() { count += 1; }
	function log(event) { console.log(event); }
</script>

<button on:click={increment} on:click={log}>clicks: {count}</button>
```

## Component Events

Components dispatch custom events using `createEventDispatcher`:

```svelte
<!--- Stepper.svelte --->
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('decrement')}>decrement</button>
<button on:click={() => dispatch('increment')}>increment</button>
```

Consumers listen for dispatched events:

```svelte
<script>
	import Stepper from './Stepper.svelte';
	let n = 0;
</script>

<Stepper
	on:decrement={() => n -= 1}
	on:increment={() => n += 1}
/>

<p>n: {n}</p>
```

`dispatch` creates a `CustomEvent`. A second argument becomes the `detail` property.

Component events do not bubble — only immediate children can be listened to. Only `once` modifier is valid on component event handlers.

**Migration note**: For Svelte 5, use callback props instead of `createEventDispatcher` (which is deprecated):

```svelte
<!--- Stepper.svelte --->
<script>
	export let decrement;
	export let increment;
</script>

<button on:click={decrement}>decrement</button>
<button on:click={increment}>increment</button>
```