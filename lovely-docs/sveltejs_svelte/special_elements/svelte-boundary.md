## svelte:boundary

A special element that creates error boundaries and handles async state in Svelte components (added in 5.3.0).

### Purpose
- Wall off parts of your app to handle errors during rendering or effects
- Show pending UI while `await` expressions resolve
- Provide error UI when rendering fails

**Important limitation**: Only catches errors during rendering and effects. Errors in event handlers, setTimeout, or other async work outside the rendering process are NOT caught.

### Properties

**pending** - A snippet shown when the boundary is first created, visible until all `await` expressions inside resolve. Not shown for subsequent async updates (use `$effect.pending()` for those instead).

```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
```

**failed** - A snippet rendered when an error is thrown, receives `error` and `reset` function arguments. When a boundary handles an error, its existing content is removed.

```svelte
<svelte:boundary>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
```

Can also be passed explicitly: `<svelte:boundary {failed}>...</svelte:boundary>`

**onerror** - A function called with `error` and `reset` arguments. Useful for error reporting or managing error state outside the boundary.

```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});
	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null;
		reset();
	}}>oops! try again</button>
{/if}
```

Errors thrown inside `onerror` (or rethrown errors) propagate to parent boundaries if they exist.