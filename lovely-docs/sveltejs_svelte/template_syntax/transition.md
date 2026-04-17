## Transitions

A transition is triggered when an element enters or leaves the DOM due to a state change. All elements in a transitioning block are kept in the DOM until all transitions complete.

The `transition:` directive creates a bidirectional transition that can be smoothly reversed mid-animation:

```svelte
<script>
	import { fade } from 'svelte/transition';
	let visible = $state(false);
</script>

<button onclick={() => visible = !visible}>toggle</button>

{#if visible}
	<div transition:fade>fades in and out</div>
{/if}
```

### Local vs Global

Transitions are local by default (only play when their block is created/destroyed). Use the `|global` modifier to make them play when parent blocks change:

```svelte
{#if x}
	{#if y}
		<p transition:fade>only when y changes</p>
		<p transition:fade|global>when x or y change</p>
	{/if}
{/if}
```

### Transition Parameters

Transitions accept parameters as an object:

```svelte
<div transition:fade={{ duration: 2000 }}>fades over two seconds</div>
```

### Custom Transition Functions

Custom transitions are functions with signature:
```js
transition = (node: HTMLElement, params: any, options: { direction: 'in' | 'out' | 'both' }) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

If the returned object has a `css` function, Svelte generates keyframes for web animations. The `t` argument is 0-1 after easing (0 for out transitions, 1 for in transitions, representing the element's natural state). The `u` argument equals `1 - t`. The function is called repeatedly before the transition begins.

Example with CSS-based animation:

```svelte
<script>
	import { elasticOut } from 'svelte/easing';
	export let visible;

	function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');
		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>

{#if visible}
	<div in:whoosh>whooshes in</div>
{/if}
```

Alternatively, return a `tick` function called during the transition (prefer `css` for performance):

```svelte
<script>
	export let visible = false;

	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;
		if (!valid) throw new Error(`Single text node child required`);

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

{#if visible}
	<p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}
```

If a transition function returns a function instead of an object, it's called in the next microtask, allowing multiple transitions to coordinate for crossfade effects.

The `options` argument contains `direction` ('in', 'out', or 'both').

### Transition Events

Elements with transitions dispatch: `introstart`, `introend`, `outrostart`, `outroend`

```svelte
{#if visible}
	<p
		transition:fly={{ y: 200, duration: 2000 }}
		onintrostart={() => (status = 'intro started')}
		onoutrostart={() => (status = 'outro started')}
		onintroend={() => (status = 'intro ended')}
		onoutroend={() => (status = 'outro ended')}
	>
		Flies in and out
	</p>
{/if}
```