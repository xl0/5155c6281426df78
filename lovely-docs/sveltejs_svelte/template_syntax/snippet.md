# Snippets in Svelte

Snippets are reusable chunks of markup declared with `{#snippet name()}...{/snippet}` syntax. They reduce code duplication by extracting repeated template patterns.

## Basic Usage

Snippets can have parameters with default values and destructuring:

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>{@render figure(image)}</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

Rendered with `{@render snippetName(args)}`.

## Scope

Snippets can reference values from their enclosing scope (script, each blocks, etc.) and are visible to siblings and their children in the same lexical scope:

```svelte
<script>
	let { message = `it's great!` } = $props();
</script>

{#snippet hello(name)}
	<p>hello {name}! {message}!</p>
{/snippet}

{@render hello('alice')}
```

Snippets can reference themselves and each other for recursion:

```svelte
{#snippet countdown(n)}
	{#if n > 0}
		<span>{n}...</span>
		{@render countdown(n - 1)}
	{:else}
		{@render blastoff()}
	{/if}
{/snippet}

{#snippet blastoff()}
	<span>🚀</span>
{/snippet}

{@render countdown(10)}
```

## Passing Snippets to Components

### Explicit Props
Snippets are values and can be passed as component props:

```svelte
{#snippet header()}
	<th>fruit</th>
	<th>qty</th>
{/snippet}

{#snippet row(d)}
	<td>{d.name}</td>
	<td>{d.qty}</td>
{/snippet}

<Table data={fruits} {header} {row} />
```

### Implicit Props
Snippets declared directly inside a component implicitly become props:

```svelte
<Table data={fruits}>
	{#snippet header()}
		<th>fruit</th>
		<th>qty</th>
	{/snippet}

	{#snippet row(d)}
		<td>{d.name}</td>
		<td>{d.qty}</td>
	{/snippet}
</Table>
```

### Implicit `children` Snippet
Content inside component tags that isn't a snippet declaration becomes the `children` snippet:

```svelte
<!-- App.svelte -->
<Button>click me</Button>

<!-- Button.svelte -->
<script>
	let { children } = $props();
</script>
<button>{@render children()}</button>
```

### Optional Snippet Props
Use optional chaining or conditional rendering for optional snippets:

```svelte
{@render children?.()}

{#if children}
	{@render children()}
{:else}
	fallback content
{/if}
```

## Typing Snippets

Import `Snippet` from `'svelte'` and use it in type definitions. The type argument is a tuple of parameter types:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		data: any[];
		children: Snippet;
		row: Snippet<[any]>;
	}

	let { data, children, row }: Props = $props();
</script>
```

Use generics to tie data and snippet types together:

```svelte
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let {
		data,
		children,
		row
	}: {
		data: T[];
		children: Snippet;
		row: Snippet<[T]>;
	} = $props();
</script>
```

## Exporting Snippets

Snippets at the top level can be exported from `<script module>` if they don't reference non-module script declarations (requires Svelte 5.5.0+):

```svelte
<script module>
	export { add };
</script>

{#snippet add(a, b)}
	{a} + {b} = {a + b}
{/snippet}
```

## Programmatic Snippets

Use `createRawSnippet` API for advanced programmatic snippet creation.

## Snippets vs Slots

Snippets replace the deprecated Svelte 4 slots feature with more power and flexibility.