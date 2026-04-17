## Using TypeScript in Svelte Components

Add `lang="ts"` to script tags to enable TypeScript:

```svelte
<script lang="ts">
	let name: string = 'world';
	function greet(name: string) {
		alert(`Hello, ${name}!`);
	}
</script>

<button onclick={(e: Event) => greet(e.target.innerText)}>
	{name as string}
</button>
```

### Type-Only Features
By default, only type-only features are supported (type annotations, interfaces, generics). Features requiring TypeScript compiler output are not supported: enums, private/protected/public modifiers with initializers in constructors, and non-standard ECMAScript features.

### Preprocessor Setup
To use non-type-only features, configure a preprocessor in `svelte.config.js`:

```ts
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: vitePreprocess({ script: true }) };
export default config;
```

For SvelteKit/Vite: `npx sv create` or `npm create vite@latest` with `svelte-ts` option automatically includes `vitePreprocess()`.

For Rollup/Webpack: install `typescript` and `svelte-preprocess`, then configure in plugin settings.

### tsconfig.json Requirements
- `target`: at least `ES2015` (so classes aren't compiled to functions)
- `verbatimModuleSyntax`: `true` (keep imports as-is)
- `isolatedModules`: `true` (each file analyzed independently)

### Typing `$props`
Define props as an interface and destructure with `$props()`:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		requiredProperty: number;
		optionalProperty?: boolean;
		snippetWithStringArgument: Snippet<[string]>;
		eventHandler: (arg: string) => void;
		[key: string]: unknown;
	}

	let { requiredProperty, optionalProperty, snippetWithStringArgument, eventHandler, ...everythingElse }: Props = $props();
</script>

<button onclick={() => eventHandler('clicked button')}>
	{@render snippetWithStringArgument('hello')}
</button>
```

### Generic `$props`
Use `generics` attribute on script tag to declare generic relationships:

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}

	let { items, select }: Props = $props();
</script>

{#each items as item}
	<button onclick={() => select(item)}>
		{item.text}
	</button>
{/each}
```

### Typing Wrapper Components
Use `HTMLButtonAttributes` from `svelte/elements` for native element wrappers:

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>
	{@render children?.()}
</button>
```

For elements without dedicated types, use `SvelteHTMLElements`:

```svelte
<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
	{@render children?.()}
</div>
```

### Typing `$state`
Type state variables normally. Without initial value, type includes `undefined`. Use `as` casting when value will be defined before use:

```ts
let count: number = $state(0);
let count: number = $state(); // Error: Type 'number | undefined' not assignable to 'number'

class Counter {
	count = $state() as number;
	constructor(initial: number) { this.count = initial; }
}
```

### Component Type
Use `Component` type to constrain dynamic components:

```svelte
<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		DynamicComponent: Component<{ prop: string }>;
	}

	let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent prop="foo" />
```

Extract component props with `ComponentProps`:

```ts
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

function withProps<TComponent extends Component<any>>(
	component: TComponent,
	props: ComponentProps<TComponent>
) {}

withProps(MyComponent, { foo: 'bar' });
```

Declare component constructor/instance types:

```svelte
<script lang="ts">
	import MyComponent from './MyComponent.svelte';
	let componentConstructor: typeof MyComponent = MyComponent;
	let componentInstance: MyComponent;
</script>

<MyComponent bind:this={componentInstance} />
```

### Enhancing Built-in DOM Types
Augment `svelte/elements` module for custom/experimental attributes and events:

```ts
/// file: additional-svelte-typings.d.ts
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}

	export interface HTMLAttributes<T> {
		globalattribute?: string;
	}

	export interface HTMLButtonAttributes {
		veryexperimentalattribute?: string;
	}
}

export {};
```

Reference the `.d.ts` file in `tsconfig.json` (e.g., `"include": ["src/**/*"]`).