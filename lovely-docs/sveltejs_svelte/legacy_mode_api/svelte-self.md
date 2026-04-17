The `<svelte:self>` element allows a component to recursively include itself. It must be placed inside an if or each block, or passed to a component's slot to prevent infinite loops.

Example:
```svelte
<script>
	export let count;
</script>

{#if count > 0}
	<p>counting down... {count}</p>
	<svelte:self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```

**Note:** This feature is obsolete. Modern Svelte allows components to import themselves directly instead:
```svelte
<script>
	import Self from './App.svelte'
	export let count;
</script>

{#if count > 0}
	<p>counting down... {count}</p>
	<Self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```