## Overview
As of Svelte 5.36, the `await` keyword can be used in three new places:
- Top level of component `<script>`
- Inside `$derived(...)` declarations
- Inside markup

Requires opt-in via `experimental.async: true` in `svelte.config.js`. Will be removed in Svelte 6.

## Synchronized Updates
When an `await` expression depends on state, UI updates wait for async work to complete, preventing inconsistent states:

```svelte
<script>
	let a = $state(1);
	let b = $state(2);
	async function add(a, b) {
		await new Promise((f) => setTimeout(f, 500));
		return a + b;
	}
</script>
<input type="number" bind:value={a}>
<input type="number" bind:value={b}>
<p>{a} + {b} = {await add(a, b)}</p>
```

Changing `a` won't update the paragraph until `add(a, b)` resolves. Updates can overlap — fast updates reflect while slow ones are ongoing.

## Concurrency
Multiple independent `await` expressions in markup run in parallel:
```svelte
<p>{await one()}</p>
<p>{await two()}</p>
```

Both functions execute simultaneously. Sequential `await` in `<script>` or async functions behave like normal JavaScript. Independent `$derived` expressions update independently but run sequentially on first creation (triggers `await_waterfall` warning).

## Loading States
Wrap content in `<svelte:boundary>` with `pending` snippet to show placeholder UI on first creation:
```svelte
<svelte:boundary pending={<p>Loading...</p>}>
	{await content()}
</svelte:boundary>
```

Use `$effect.pending()` to detect subsequent async work. Use `settled()` to wait for current update completion:
```js
import { tick, settled } from 'svelte';
async function onclick() {
	updating = true;
	await tick();
	color = 'octarine';
	answer = 42;
	await settled();
	updating = false;
}
```

## Error Handling
Errors in `await` expressions bubble to nearest error boundary.

## Server-Side Rendering
Svelte supports async SSR with `render(...)` API:
```js
import { render } from 'svelte/server';
import App from './App.svelte';
const { head, body } = await render(App);
```

If `<svelte:boundary>` with `pending` snippet is encountered during SSR, the pending snippet renders while content is ignored. All `await` expressions outside boundaries with pending snippets resolve before `render(...)` returns.

## Forking
The `fork(...)` API (added in 5.42) runs `await` expressions expected to happen soon, useful for preloading:
```svelte
<script>
	import { fork } from 'svelte';
	let open = $state(false);
	let pending = null;
	function preload() {
		pending ??= fork(() => { open = true; });
	}
	function discard() {
		pending?.discard();
		pending = null;
	}
</script>
<button
	onfocusin={preload}
	onfocusout={discard}
	onpointerenter={preload}
	onpointerleave={discard}
	onclick={() => {
		pending?.commit();
		pending = null;
		open = true;
	}}
>open menu</button>
{#if open}
	<Menu onclose={() => open = false} />
{/if}
```

## Caveats
Experimental feature — details subject to breaking changes outside semver major release. Effects run in different order when `experimental.async` is true: block effects run before `$effect.pre` or `beforeUpdate` in same component.