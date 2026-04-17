## Actions with `use:` directive

Actions are functions called when an element is mounted, added via the `use:` directive. They typically use `$effect` to manage setup and teardown:

```svelte
<script>
	function myaction(node) {
		$effect(() => {
			// setup
			return () => {
				// teardown
			};
		});
	}
</script>

<div use:myaction>...</div>
```

Actions can accept arguments:

```svelte
function myaction(node, data) { /* ... */ }
<div use:myaction={data}>...</div>
```

The action runs once on mount (not during SSR) and does not re-run if the argument changes.

## Typing

The `Action` interface accepts three optional type parameters: node type (e.g., `HTMLDivElement` or `Element`), parameter type, and custom event handlers:

```svelte
/**
 * @type {import('svelte/action').Action<
 * 	HTMLDivElement,
 * 	undefined,
 * 	{
 * 		onswiperight: (e: CustomEvent) => void;
 * 		onswipeleft: (e: CustomEvent) => void;
 * 	}
 * >}
 */
function gestures(node) {
	$effect(() => {
		node.dispatchEvent(new CustomEvent('swipeleft'));
		node.dispatchEvent(new CustomEvent('swiperight'));
	});
}
```

Use in template:
```svelte
<div use:gestures onswipeleft={next} onswiperight={prev}>...</div>
```

**Legacy note:** Prior to `$effect`, actions could return objects with `update` and `destroy` methods. Using effects is preferred. In Svelte 5.29+, consider using attachments instead for more flexibility.