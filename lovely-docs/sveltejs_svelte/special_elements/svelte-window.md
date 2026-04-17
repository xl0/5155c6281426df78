## `<svelte:window>` Element

Adds event listeners to the `window` object with automatic cleanup on component destruction and SSR safety.

**Usage:**
```svelte
<svelte:window onevent={handler} />
<svelte:window bind:prop={value} />
```

**Constraints:**
- Must appear at top level of component only (not inside blocks or elements)

**Event Listeners:**
Attach any window event handler using `onevent={handler}` syntax:
```svelte
<script>
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

**Bindable Properties (readonly except scrollX/scrollY):**
- `innerWidth`, `innerHeight`
- `outerWidth`, `outerHeight`
- `scrollX`, `scrollY` (writable)
- `online` (alias for `window.navigator.onLine`)
- `devicePixelRatio`

**Example:**
```svelte
<svelte:window bind:scrollY={y} />
```

**Note:** Initial values of `scrollX`/`scrollY` don't trigger scrolling (accessibility). Use `scrollTo()` in `$effect` if you need to scroll on mount.