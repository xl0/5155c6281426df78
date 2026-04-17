## Minimum version requirements
- Node 16+, SvelteKit 1.20.4+, vite-plugin-svelte 2.4.1+, webpack 5+ with svelte-loader 3.1.8+, rollup-plugin-svelte 7.1.5+, TypeScript 5+

## Browser conditions for bundlers
Bundlers must specify the `browser` condition. For Rollup: set `browser: true` in `@rollup/plugin-node-resolve`. For webpack: add `"browser"` to `conditionNames` array.

## Removal of CJS output
CommonJS format, `svelte/register` hook, and CJS runtime removed. Use a bundler to convert ESM to CJS if needed.

## Stricter types for Svelte functions

`createEventDispatcher` now enforces payload requirements:
```ts
const dispatch = createEventDispatcher<{
	optional: number | null;
	required: string;
	noArgument: null;
}>();
dispatch('optional'); // ok
dispatch('required'); // error: missing argument
dispatch('noArgument', 'surprise'); // error: cannot pass argument
```

`Action` and `ActionReturn` default to `undefined` parameter type - must specify generic if action receives parameters:
```ts
const action: Action<HTMLElement, string> = (node, params) => { ... }
```

`onMount` now errors if you return a function asynchronously (likely a bug):
```ts
// Wrong - cleanup not called
onMount(async () => {
	const something = await foo();
	return () => someCleanup();
});

// Correct - cleanup called
onMount(() => {
	foo().then(something => {...});
	return () => someCleanup();
});
```

## Custom Elements with Svelte
`tag` option deprecated, use `customElement` instead:
```svelte
<svelte:options customElement="my-component" />
```

## SvelteComponentTyped deprecated
Replace with `SvelteComponent`:
```ts
import { SvelteComponent } from 'svelte';
export class Foo extends SvelteComponent<{ aProp: string }> {}
```

When using as instance type, use `typeof SvelteComponent<any>`:
```ts
let component: typeof SvelteComponent<any>;
```

## Transitions are local by default
Transitions only play when direct parent control flow block is created/destroyed, not ancestor blocks. Use `|global` modifier for old behavior:
```svelte
{#if show}
	{#if success}
		<p in:slide|global>Success</p>
	{/if}
{/if}
```

## Default slot bindings
Default slot bindings no longer exposed to named slots:
```svelte
<Nested let:count>
	<p>{count}</p>
	<p slot="bar">{count}</p> <!-- count not available here -->
</Nested>
```

## Preprocessors
Execution order changed: preprocessors run in order, within each preprocessor: markup → script → style.
```js
preprocess: [
	mdsvex(mdsvexConfig),  // must come before vitePreprocess
	vitePreprocess()
]
```
Each preprocessor must have a name.

## New eslint package
`eslint-plugin-svelte3` deprecated. Use `eslint-plugin-svelte` instead.

## Other breaking changes
- `inert` attribute applied to outroing elements
- Runtime uses `classList.toggle(name, boolean)` - may need polyfill for old browsers
- Runtime uses `CustomEvent` constructor - may need polyfill for old browsers
- `StartStopNotifier` interface now requires update function in addition to set function
- `derived` throws error on falsy values instead of stores
- Type definitions for `svelte/internal` removed
- DOM node removal now batched, may affect event order with `MutationObserver`
- Global typings: migrate from `svelte.JSX` namespace to `svelteHTML` namespace and `svelte/elements` types