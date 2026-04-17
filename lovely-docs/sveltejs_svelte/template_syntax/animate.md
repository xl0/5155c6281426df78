## Overview
Animations are triggered when contents of a keyed each block are reordered. Animations only run when the index of an existing data item changes, not when elements are added or removed. Animate directives must be on immediate children of keyed each blocks.

## Built-in and Custom Animations
Svelte provides built-in animation functions and supports custom animation functions.

```svelte
{#each list as item, index (item)}
	<li animate:flip>{item}</li>
{/each}
```

## Animation Parameters
Animations accept parameters as object literals:

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

## Custom Animation Functions
Custom animation functions receive `node`, an `animation` object with `from` and `to` DOMRect properties, and `params`. They return an object with optional `delay`, `duration`, `easing`, `css`, and `tick` properties.

The `css` method receives `t` (0 to 1 after easing) and `u` (1 - t), and is called repeatedly before animation begins. Svelte creates a web animation from the returned CSS.

```js
function whizz(node, { from, to }, params) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const d = Math.sqrt(dx * dx + dy * dy);
	
	return {
		delay: 0,
		duration: Math.sqrt(d) * 120,
		easing: cubicOut,
		css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
	};
}

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```

Alternatively, return a `tick` function called during animation with same `t` and `u` arguments:

```js
function whizz(node, { from, to }, params) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const d = Math.sqrt(dx * dx + dy * dy);
	
	return {
		delay: 0,
		duration: Math.sqrt(d) * 120,
		easing: cubicOut,
		tick: (t, u) => Object.assign(node.style, { color: t > 0.5 ? 'Pink' : 'Blue' })
	};
}

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```

Prefer `css` over `tick` when possible — web animations run off the main thread and prevent jank on slower devices.