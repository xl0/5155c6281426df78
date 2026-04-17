## $derived

Declares derived (computed) state that automatically updates when dependencies change.

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>{doubled}</button>
<p>{count} doubled is {doubled}</p>
```

Expressions must be side-effect free; state mutations like `count++` are disallowed inside derived expressions. Can be used on class fields.

### $derived.by

For complex derivations, use `$derived.by` with a function:

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) total += n;
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

`$derived(expression)` is equivalent to `$derived.by(() => expression)`.

### Dependencies

Anything read synchronously inside the derived expression is a dependency. When dependencies change, the derived is marked dirty and recalculated on next read. Use `untrack` to exempt state from being treated as a dependency.

### Overriding derived values

Derived values can be temporarily reassigned (unless declared with `const`), useful for optimistic UI:

```svelte
<script>
	let { post, like } = $props();
	let likes = $derived(post.likes);

	async function onclick() {
		likes += 1;
		try {
			await like();
		} catch {
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```

### Reactivity differences

Unlike `$state`, `$derived` values are not converted to deeply reactive proxies. They remain as-is, so mutating properties of a derived object affects the underlying source array/object.

### Destructuring

Destructuring with `$derived` makes all resulting variables reactive:

```js
let { a, b, c } = $derived(stuff());
// equivalent to:
let _stuff = $derived(stuff());
let a = $derived(_stuff.a);
let b = $derived(_stuff.b);
let c = $derived(_stuff.c);
```

### Update propagation

Svelte uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to its previous value, downstream updates are skipped:

```svelte
<script>
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>{large}</button>
```

Button only updates when `large` changes, not when `count` changes.