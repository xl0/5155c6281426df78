## Overview
Attachments are functions that run in an effect when an element is mounted to the DOM or when state read inside the function updates. They can optionally return a cleanup function called before re-run or after element removal. Available in Svelte 5.29+.

## Basic Usage
```svelte
<script>
	function myAttachment(element) {
		console.log(element.nodeName);
		return () => {
			console.log('cleaning up');
		};
	}
</script>

<div {@attach myAttachment}>...</div>
```

Elements can have multiple attachments.

## Attachment Factories
Functions can return attachments, useful for parameterized behavior:
```svelte
<script>
	import tippy from 'tippy.js';
	let content = $state('Hello!');

	function tooltip(content) {
		return (element) => {
			const tooltip = tippy(element, { content });
			return tooltip.destroy;
		};
	}
</script>

<input bind:value={content} />
<button {@attach tooltip(content)}>Hover me</button>
```

The attachment re-runs whenever `content` changes or any state read inside the attachment function changes.

## Inline Attachments
Attachments can be defined inline:
```svelte
<canvas
	width={32}
	height={32}
	{@attach (canvas) => {
		const context = canvas.getContext('2d');
		$effect(() => {
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
		});
	}}
></canvas>
```

The nested effect runs when `color` changes; the outer effect runs once since it doesn't read reactive state.

## Passing Attachments to Components
When used on a component, `{@attach ...}` creates a prop with a Symbol key. If the component spreads props onto an element, the element receives those attachments. This enables wrapper components:

```svelte
<!-- Button.svelte -->
<script>
	let { children, ...props } = $props();
</script>
<button {...props}>{@render children?.()}</button>

<!-- App.svelte -->
<script>
	import Button from './Button.svelte';
	function tooltip(content) {
		return (element) => {
			const tooltip = tippy(element, { content });
			return tooltip.destroy;
		};
	}
</script>
<Button {@attach tooltip(content)}>Hover me</Button>
```

## Controlling Re-runs
Attachments are fully reactive: `{@attach foo(bar)}` re-runs on changes to `foo`, `bar`, or any state read inside `foo`. To avoid expensive setup work re-running, pass data via a function and read it in a child effect:

```js
function foo(getBar) {
	return (node) => {
		veryExpensiveSetupWork(node);
		$effect(() => {
			update(node, getBar());
		});
	}
}
```

## Programmatic Creation
Use `createAttachmentKey` to add attachments to objects that will be spread onto components or elements.

## Converting Actions
Use `fromAction` to convert library actions to attachments, enabling use with components.