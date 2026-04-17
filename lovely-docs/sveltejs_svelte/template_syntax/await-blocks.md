## Await Blocks

Await blocks allow you to branch on the three possible states of a Promise: pending, fulfilled, or rejected.

### Syntax

```svelte
{#await expression}...{:then name}...{:catch name}...{/await}
{#await expression}...{:then name}...{/await}
{#await expression then name}...{/await}
{#await expression catch name}...{/await}
```

### Full Example with All States

```svelte
{#await promise}
	<p>waiting for the promise to resolve...</p>
{:then value}
	<p>The value is {value}</p>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}
```

### Omitting Blocks

The `catch` block can be omitted if you don't need to handle rejections:

```svelte
{#await promise}
	<p>waiting...</p>
{:then value}
	<p>The value is {value}</p>
{/await}
```

Omit the initial pending block if you don't care about that state:

```svelte
{#await promise then value}
	<p>The value is {value}</p>
{/await}
```

Omit the `then` block to show only the error state:

```svelte
{#await promise catch error}
	<p>The error is {error}</p>
{/await}
```

### Server-Side Rendering

During server-side rendering, only the pending branch will be rendered. If the expression is not a Promise, only the `then` branch will be rendered.

### Lazy Component Loading

Use with dynamic imports to render components lazily:

```svelte
{#await import('./Component.svelte') then { default: Component }}
	<Component />
{/await}
```