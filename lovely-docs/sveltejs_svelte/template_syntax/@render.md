The `{@render ...}` tag renders a snippet. Snippets are reusable template blocks that can be passed as props or defined locally.

**Basic usage:**
```svelte
{#snippet sum(a, b)}
	<p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
{@render sum(5, 6)}
```

The expression can be a simple identifier or any JavaScript expression:
```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

**Optional snippets:**
When a snippet might be undefined (e.g., from a prop), use optional chaining to render only when defined:
```svelte
{@render children?.()}
```

Or use conditional rendering with fallback content:
```svelte
{#if children}
	{@render children()}
{:else}
	<p>fallback content</p>
{/if}
```