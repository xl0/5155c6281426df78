## :global(...) modifier

Apply styles to a single selector globally using the `:global(...)` modifier:

```svelte
<style>
	:global(body) {
		margin: 0;
	}

	div :global(strong) {
		color: goldenrod;
	}

	p:global(.big.red) {
		/* applies to <p> with class="big red" */
	}
</style>
```

For globally accessible @keyframes, prepend the keyframe name with `-global-`. The prefix is removed during compilation:

```svelte
<style>
	@keyframes -global-my-animation-name {
		/* code */
	}
</style>
```

## :global block

Apply styles to a group of selectors globally using a `:global {...}` block:

```svelte
<style>
	:global {
		div { ... }
		p { ... }
	}

	.a :global {
		.b .c .d { ... }
	}
</style>
```

Alternatively, use `.a :global .b .c .d` syntax where everything after `:global` is unscoped (nested form preferred).