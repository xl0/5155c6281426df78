## Props Declaration

In legacy mode, component props are declared using the `export` keyword with optional default values:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
	console.log({ foo });
</script>
```

Default values are used when props would otherwise be `undefined`. Props without defaults are required; Svelte warns during development if not provided. Suppress warnings by setting `undefined` as default: `export let foo = undefined;`

Unlike runes mode, if a parent changes a prop from a defined value to `undefined`, it does not revert to the initial value.

## Component Exports

Exported `const`, `class`, or `function` declarations are not props—they become part of the component's public API:

```svelte
// Greeter.svelte
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>

// App.svelte
<script>
	import Greeter from './Greeter.svelte';
	let greeter;
</script>

<Greeter bind:this={greeter} />
<button on:click={() => greeter.greet('world')}>greet</button>
```

## Renaming Props

Use separate `export` keyword to rename props, useful for reserved words:

```svelte
<script>
	let className;
	export { className as class };
</script>
```