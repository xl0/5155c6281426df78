## $bindable Rune

Marks a component prop as bindable, allowing data to flow bidirectionally between parent and child components. By default, props flow one-way from parent to child, but bindable props enable the child to communicate changes back to the parent.

### Usage

Mark a prop as bindable using the `$bindable()` rune:

```svelte
// FancyInput.svelte
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />

<style>
	input {
		font-family: 'Comic Sans MS';
		color: deeppink;
	}
</style>
```

Parent components can then use the `bind:` directive to bind to the bindable prop:

```svelte
// App.svelte
<script>
	import FancyInput from './FancyInput.svelte';
	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

### Key Points

- Bindable props allow state to flow from child to parent, enabling mutation of state proxies in the child
- Normal props can also be mutated, but Svelte warns against this
- Parent components don't have to use `bind:` — they can pass a normal prop if they don't want to listen to child changes
- Specify a fallback value for when no prop is passed: `let { value = $bindable('fallback'), ...props } = $props();`
- Should be used sparingly and carefully to maintain clear data flow