The `{@const ...}` tag defines a local constant within a block scope.

**Usage:**
```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

**Constraints:**
- Only allowed as an immediate child of a block (`{#if ...}`, `{#each ...}`, `{#snippet ...}`, etc.), a `<Component />`, or a `<svelte:boundary>`
- Creates a variable that is scoped to the containing block