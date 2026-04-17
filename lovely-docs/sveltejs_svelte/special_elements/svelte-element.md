## `<svelte:element>` Component

Renders a DOM element whose tag name is determined at runtime via the `this` prop.

**Purpose**: Useful when the element type is unknown at author time, such as when it comes from a CMS or dynamic source.

**Basic usage**:
```svelte
<svelte:element this={expression} />
```

**Key behaviors**:
- If `this` is nullish, the element and its children are not rendered
- Only `bind:this` binding is supported; other Svelte bindings don't work with generic elements
- All properties and event listeners are applied to the rendered element
- `this` must be a valid DOM element tag name (e.g., `div`, `span`, `hr`); invalid values like `#text` or `svelte:head` will not work

**Void element handling**: If `this` is a void element (e.g., `br`, `hr`) and the component has child elements, a runtime error is thrown in development mode:
```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	This text cannot appear inside an hr element
</svelte:element>
```

**Namespace handling**: Svelte attempts to infer the correct namespace from context, but you can make it explicit with the `xmlns` attribute:
```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```