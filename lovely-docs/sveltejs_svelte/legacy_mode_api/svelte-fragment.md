The `<svelte:fragment>` element allows you to place content in a named slot without wrapping it in a container DOM element, preserving document flow layout.

**Example:**

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>

<!-- App.svelte -->
<Widget>
	<h1 slot="header">Hello</h1>
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

Without `<svelte:fragment>`, you would need to wrap multiple elements in a container (like a `<div>`) to fill a named slot, which adds an extra DOM node. `<svelte:fragment>` solves this by being an invisible wrapper that doesn't render to the DOM.

**Note:** In Svelte 5+, this is obsolete as snippets don't create wrapping elements.