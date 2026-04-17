## Context API

Context allows components to access values from parent components without prop-drilling through intermediate layers.

**Basic usage:**
```svelte
// Parent.svelte
<script>
	import { setContext } from 'svelte';
	setContext('my-context', 'hello from Parent.svelte');
</script>

// Child.svelte
<script>
	import { getContext } from 'svelte';
	const message = getContext('my-context');
</script>
<h1>{message}, inside Child.svelte</h1>
```

The key and context value can be any JavaScript value. Available functions: `setContext`, `getContext`, `hasContext`, `getAllContexts`.

**Reactive state in context:**
Store reactive state objects in context. Mutate the object directly; reassigning breaks the link:
```svelte
<script>
	import { setContext } from 'svelte';
	let counter = $state({ count: 0 });
	setContext('counter', counter);
</script>

<button onclick={() => counter.count += 1}>increment</button>

// Child.svelte
const counter = getContext('counter');
```

**Type-safe context with `createContext`:**
```ts
// context.ts
import { createContext } from 'svelte';
export const [getUserContext, setUserContext] = createContext<User>();
```

**Global state alternative:**
Context is preferable to module-level `$state` for server-side rendering, as context is not shared between requests while module state persists across users.