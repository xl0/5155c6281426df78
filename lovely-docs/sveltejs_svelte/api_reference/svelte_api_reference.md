## Core Components and Types

**SvelteComponent** - Base class for Svelte 4 components (deprecated in Svelte 5+). Use `Component` type and `mount()` function instead. Had methods like `$destroy()`, `$on()`, `$set()` which are now deprecated.

**SvelteComponentTyped** - Typed variant of SvelteComponent (deprecated, use `Component` instead).

**Component** - Type for creating strongly typed Svelte components. Example:
```ts
import type { Component } from 'svelte';
export declare const MyComponent: Component<{ foo: string }> {}
```
Can be used in TypeScript to provide intellisense and type checking when using components.

## Lifecycle Functions

**onMount** - Runs once after component mounts to DOM. Can return cleanup function. Doesn't run during SSR.
```ts
onMount(() => {
  console.log('mounted');
  return () => console.log('cleanup');
});
```

**onDestroy** - Runs before component unmounts. Only lifecycle that runs in SSR.

**beforeUpdate** (deprecated, use `$effect.pre`) - Runs before component updates after state changes.

**afterUpdate** (deprecated, use `$effect`) - Runs after component updates.

## Context API

**createContext** - Type-safe context pair (available since 5.40.0):
```ts
const [getTheme, setTheme] = createContext<string>();
// In parent: setTheme('dark')
// In child: const theme = getTheme()
```

**getContext** - Retrieves context by key from parent component.

**setContext** - Associates context object with key for children to access.

**getAllContexts** - Gets entire context map from closest parent.

**hasContext** - Checks if key exists in parent context.

## Event Handling

**createEventDispatcher** (deprecated, use callback props or `$host()`) - Creates typed event dispatcher:
```ts
const dispatch = createEventDispatcher<{
  loaded: null;
  change: string;
  optional: number | null;
}>();
dispatch('change', 'value');
```

## Component Mounting

**mount** - Mounts component to target, returns exports:
```ts
import { mount } from 'svelte';
import App from './App.svelte';
const app = mount(App, { target: document.body, props: { foo: 'bar' } });
```

**hydrate** - Hydrates component on given target with SSR-rendered HTML.

**unmount** - Unmounts component, optionally plays outro transitions:
```ts
unmount(app, { outro: true });
```

## State and Synchronization

**tick** - Returns promise that resolves after pending state changes applied to DOM.

**settled** - Returns promise that resolves after state changes and async work complete (available since 5.36).

**flushSync** - Synchronously flushes pending updates, optionally runs callback:
```ts
flushSync(() => { /* updates applied immediately */ });
```

**fork** - Creates off-screen fork for speculative state changes (available since 5.42):
```ts
const fork = fork(() => { state.value = 'new'; });
// Later: fork.commit() or fork.discard()
```

## Utilities

**untrack** - Prevents state reads inside function from being treated as dependencies:
```ts
$effect(() => {
  save(data, { timestamp: untrack(() => time) });
});
```

**getAbortSignal** - Returns AbortSignal that aborts when derived/effect re-runs or destroys:
```ts
const data = $derived(await fetch('/items', { signal: getAbortSignal() }));
```

**createRawSnippet** - Creates snippet programmatically with render and optional setup functions.

## Types

**ComponentProps** - Extracts props type from component:
```ts
const props: ComponentProps<typeof MyComponent> = { foo: 'bar' };
```

**ComponentConstructorOptions** (deprecated) - Options for old class-based component constructor.

**ComponentEvents** (deprecated) - Extracts events type from SvelteComponent.

**ComponentType** (deprecated) - Type for class-based components.

**EventDispatcher** - Interface for event dispatcher with typed dispatch method.

**Fork** - Interface with `commit()` and `discard()` methods.

**MountOptions** - Options for mount function: target, anchor, events, context, intro.

**Snippet** - Type for snippet blocks with typed parameters.

**ComponentInternals** - Internal implementation details (branded type).