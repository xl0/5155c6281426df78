## Conditional Rendering with If Blocks

Wrap content in `{#if expression}...{/if}` blocks to conditionally render it based on expressions.

```svelte
{#if answer === 42}
	<p>what was the question?</p>
{/if}
```

Add additional conditions with `{:else if expression}`:

```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```

Blocks can wrap elements or text within elements. Use `{:else}` for a final fallback clause.