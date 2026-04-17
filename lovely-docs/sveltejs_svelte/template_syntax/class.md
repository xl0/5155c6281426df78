## Setting Classes on Elements

Two approaches: `class` attribute and `class:` directive.

### Class Attribute

**Primitive values:**
```svelte
<div class={large ? 'large' : 'small'}>...</div>
```

Note: Falsy values like `false` and `NaN` are stringified to `class="false"`, but `undefined`/`null` omit the attribute entirely. Future versions will omit all falsy values.

**Objects and arrays (Svelte 5.16+):**

Objects - truthy keys become classes:
```svelte
<script>
	let { cool } = $props();
</script>
<div class={{ cool, lame: !cool }}>...</div>
```

Arrays - truthy values combined:
```svelte
<div class={[faded && 'saturate-0 opacity-50', large && 'scale-200']}>...</div>
```

Arrays can nest arrays and objects (flattened by clsx), useful for combining local classes with props:
```svelte
<!-- Button.svelte -->
<button {...props} class={['cool-button', props.class]}>
	{@render props.children?.()}
</button>

<!-- App.svelte -->
<Button
	onclick={() => useTailwind = true}
	class={{ 'bg-blue-700 sm:w-1/2': useTailwind }}
>
	Accept the inevitability of Tailwind
</Button>
```

**Type safety (Svelte 5.19+):**
```svelte
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	const props: { class: ClassValue } = $props();
</script>
<div class={['original', props.class]}>...</div>
```

### Class Directive

`class:` directive for conditional classes (pre-5.16 approach):
```svelte
<!-- Equivalent to object form -->
<div class:cool={cool} class:lame={!cool}>...</div>

<!-- Shorthand when name matches value -->
<div class:cool class:lame={!cool}>...</div>
```

Recommendation: Use `class` attribute instead, it's more powerful and composable.