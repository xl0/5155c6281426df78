## Reactive $: Statements in Legacy Mode

In legacy Svelte, reactive statements use the `$:` label prefix on top-level statements. These run after other script code and before markup rendering, then re-run whenever their dependencies change.

### Basic Usage

```svelte
<script>
	let a = 1;
	let b = 2;

	$: console.log(`${a} + ${b} = ${sum}`);
	$: sum = a + b;
</script>
```

Reactive assignments (like `$: sum = a + b`) automatically recalculate when dependencies change. No separate declaration needed.

### Multiple Statements in Blocks

```js
$: {
	total = 0;
	for (const item of items) {
		total += item.value;
	}
}
```

### Destructuring

```js
$: ({ larry, moe, curly } = stooges);
```

### Topological Ordering

Statements are automatically ordered by dependencies. In the example above, `sum` is calculated before the `console.log` even though it appears later, because `console.log` depends on `sum`.

### Understanding Dependencies

Dependencies are determined at compile time by analyzing which variables are referenced (not assigned). This means:

```js
let count = 0;
let double = () => count * 2;
$: doubled = double();  // Won't re-run when count changes - compiler can't see the dependency
```

Indirect dependencies also fail:

```svelte
<script>
	let x = 0;
	let y = 0;

	$: z = y;
	$: setY(x);  // y is updated here, but z won't re-run because y isn't marked dirty

	function setY(value) {
		y = value;
	}
</script>
```

Fix by reordering: `$: setY(x)` before `$: z = y`.

### Browser-Only Code

Reactive statements run during SSR. Wrap browser-only code in a conditional:

```js
$: if (browser) {
	document.title = title;
}
```