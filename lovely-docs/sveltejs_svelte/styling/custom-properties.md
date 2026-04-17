## Passing CSS Custom Properties to Components

Pass CSS custom properties (both static and dynamic) to components using the `--property-name` syntax:

```svelte
<Slider
	bind:value
	min={0}
	max={100}
	--track-color="black"
	--thumb-color="rgb({r} {g} {b})"
/>
```

This desugars to a wrapper element with the custom properties in its style attribute. For regular components, a `<svelte-css-wrapper style="display: contents; ...">` is used. For SVG elements, a `<g>` element is used instead:

```svelte
<!-- Regular component desugars to: -->
<svelte-css-wrapper style="display: contents; --track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider bind:value min={0} max={100} />
</svelte-css-wrapper>

<!-- SVG element desugars to: -->
<g style="--track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider bind:value min={0} max={100} />
</g>
```

## Reading Custom Properties Inside Components

Inside a component, read custom properties using CSS `var()` function with optional fallback values:

```svelte
<style>
	.track {
		background: var(--track-color, #aaa);
	}

	.thumb {
		background: var(--thumb-color, blue);
	}
</style>
```

## Inheritance and Global Definition

Custom properties don't need to be specified directly on the component—they inherit from parent elements. Define them on the `:root` element in a global stylesheet to apply them application-wide.

## Layout Caveat

The wrapper element (`display: contents` or `<g>`) doesn't affect layout but will affect CSS selectors using the `>` combinator that target elements directly inside the component's container.