## $effect

Effects are functions that run when state updates. They only run in the browser, not during server-side rendering. Use them for side effects like calling third-party libraries, drawing on canvas, or making network requests.

**Don't update state inside effects** — it causes convoluted code and infinite loops. Use `$derived` instead.

### Basic usage

```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');
	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Svelte automatically tracks which state/derived values are accessed and re-runs the effect when they change.

### Lifecycle

Effects run after component mount and in a microtask after state changes. Re-runs are batched. Can be used anywhere, not just top-level, as long as called while a parent effect is running.

Effects can return a teardown function that runs before re-run or when component is destroyed:

```svelte
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => clearInterval(interval);
	});
</script>

<h1>{count}</h1>
<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

### Understanding dependencies

`$effect` tracks reactive values (`$state`, `$derived`, `$props`) that are **synchronously** read in the function body (including via function calls). Asynchronous reads (after `await` or inside `setTimeout`) are not tracked.

```ts
$effect(() => {
	context.fillStyle = color; // tracked
	setTimeout(() => {
		context.fillRect(0, 0, size, size); // size not tracked
	}, 0);
});
```

Effects only re-run when the object itself changes, not when properties inside it change:

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	$effect(() => {
		state; // runs once, state never reassigned
	});

	$effect(() => {
		state.value; // re-runs when state.value changes
	});

	$effect(() => {
		derived; // re-runs, derived is new object each time
	});
</script>

<button onclick={() => (state.value += 1)}>{state.value}</button>
<p>{state.value} doubled is {derived.value}</p>
```

Dependencies are determined by what was read in the **last run**. Conditional code affects this:

```ts
let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
	if (condition) {
		confetti({ colors: [color] }); // if true: depends on both
	} else {
		confetti(); // if false: only depends on condition
	}
});
```

### $effect.pre

Runs code **before** DOM updates:

```svelte
<script>
	import { tick } from 'svelte';
	let div = $state();
	let messages = $state([]);

	$effect.pre(() => {
		if (!div) return;
		messages.length; // reference to re-run on changes
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

Works exactly like `$effect` except for timing.

### $effect.tracking()

Advanced rune that returns whether code is running inside a tracking context (effect or template):

```svelte
<script>
	console.log('setup:', $effect.tracking()); // false

	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

Used to implement abstractions that only create listeners if values are being tracked.

### $effect.pending()

Returns count of pending promises in current boundary (not including child boundaries):

```svelte
<button onclick={() => a++}>a++</button>
<button onclick={() => b++}>b++</button>

<p>{a} + {b} = {await add(a, b)}</p>

{#if $effect.pending()}
	<p>pending promises: {$effect.pending()}</p>
{/if}
```

### $effect.root()

Advanced rune that creates a non-tracked scope without auto-cleanup. Useful for nested effects you want to manually control, or creating effects outside component initialization:

```js
const destroy = $effect.root(() => {
	$effect(() => {
		// setup
	});

	return () => {
		// cleanup
	};
});

destroy(); // later
```

### When not to use $effect

**Don't synchronize state with effects.** Instead of:

```svelte
<script>
	let count = $state(0);
	let doubled = $state();

	$effect(() => {
		doubled = count * 2; // bad
	});
</script>
```

Use `$derived`:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

For complex expressions, use `$derived.by`. Deriveds can be directly overridden (as of Svelte 5.25) for optimistic UI.

**Don't use effects to link values.** Instead of effects with circular dependencies:

```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $state(total);

	$effect(() => { left = total - spent; }); // bad
	$effect(() => { spent = total - left; }); // bad
</script>
```

Use `$derived` and function bindings:

```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $derived(total - spent);

	function updateLeft(newLeft) {
		spent = total - newLeft;
	}
</script>

<input bind:value={() => left, updateLeft} max={total} />
```

If you must update `$state` in an effect and hit infinite loops from reading/writing the same state, use `untrack()`.