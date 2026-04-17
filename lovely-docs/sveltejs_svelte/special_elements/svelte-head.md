## `<svelte:head>`

Inserts elements into `document.head`. During server-side rendering, head content is exposed separately from body content.

**Constraints:**
- May only appear at the top level of a component
- Must never be inside a block or element

**Example:**
```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```