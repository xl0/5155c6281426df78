{#key expression}...{/key} block destroys and recreates its contents when the expression value changes.

When wrapping components, causes them to be reinstantiated and reinitialised:
```svelte
{#key value}
	<Component />
{/key}
```

Useful for triggering transitions whenever a value changes:
```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```