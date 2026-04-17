In legacy mode (pre-runes), use `$$props` and `$$restProps` to access component props:

- `$$props`: object containing all props passed to the component, including undeclared ones
- `$$restProps`: object containing all props except those individually declared with `export`

Example - Button component passing props to underlying button element while excluding the `variant` prop:

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>

<style>
	.variant-danger {
		background: red;
	}
</style>
```

Note: In Svelte 3/4, using `$$props` and `$$restProps` incurs a modest performance penalty and should only be used when necessary. In runes mode, use the `$props` rune instead.