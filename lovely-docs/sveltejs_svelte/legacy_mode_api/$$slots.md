In legacy mode, `$$slots` is an object that tells you which slots were provided to a component by its parent. The keys of `$$slots` are the names of the slots that were passed in.

Use `$$slots` to conditionally render content based on whether a slot was provided:

```svelte
<div>
	<slot name="title" />
	{#if $$slots.description}
		<hr />
		<slot name="description" />
	{/if}
</div>
```

When a parent component uses this component without providing a `description` slot, that conditional block won't render. In runes mode, you can check snippet props directly instead of using `$$slots`.