## Scoped Styles

Svelte components can include a `<style>` element containing CSS that is automatically scoped to that component only. Styles will not leak to elements outside the component.

**Implementation**: Scoping works by adding a hash-based class to affected elements (e.g., `svelte-123xyz`).

```svelte
<style>
	p {
		/* only affects <p> in this component */
		color: burlywood;
	}
</style>
```

**Specificity**: Each scoped selector receives a specificity increase of 0-1-0 from the scoping class. This means component styles take precedence over global stylesheets, even if the global stylesheet loads later. When the scoping class must be added multiple times to a selector, subsequent occurrences use `:where(.svelte-xyz123)` to avoid further specificity increases.

**Scoped Keyframes**: `@keyframes` defined in a component are scoped using the same hashing approach. Animation rules referencing these keyframes are automatically adjusted:

```svelte
<style>
	.bouncy {
		animation: bounce 10s;
	}

	@keyframes bounce {
		/* keyframes only accessible inside this component */
	}
</style>
```