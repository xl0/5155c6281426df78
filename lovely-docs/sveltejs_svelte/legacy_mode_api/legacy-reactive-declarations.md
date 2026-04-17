## Reactive Variables in Legacy Mode

In legacy mode, variables declared at the top level of a component are automatically reactive. Reassigning or mutating these variables triggers UI updates.

```svelte
<script>
	let count = 0;
</script>

<button on:click={() => count += 1}>
	clicks: {count}
</button>
```

### Assignment-Based Reactivity

Legacy mode reactivity is based on assignments. Array methods like `.push()` and `.splice()` don't automatically trigger updates because they mutate without reassigning. A subsequent assignment is required to notify the compiler:

```svelte
<script>
	let numbers = [1, 2, 3, 4];

	function addNumber() {
		numbers.push(numbers.length + 1); // mutation, no update
		numbers = numbers; // assignment triggers update
	}
</script>
```