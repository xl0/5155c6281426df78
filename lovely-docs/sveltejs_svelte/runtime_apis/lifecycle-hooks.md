## Component Lifecycle in Svelte 5

Svelte 5 simplifies the component lifecycle to two phases: creation and destruction. State updates don't trigger component-level hooks; instead, individual render effects react to specific state changes.

### `onMount`

Schedules a callback to run after the component mounts to the DOM. Must be called during component initialization (can be in external modules). Does not run in server-rendered components.

```svelte
import { onMount } from 'svelte';

onMount(() => {
  console.log('mounted');
});
```

If `onMount` returns a function, it runs on unmount (cleanup). Only works with synchronous functions; async functions return a Promise.

```svelte
onMount(() => {
  const interval = setInterval(() => console.log('beep'), 1000);
  return () => clearInterval(interval);
});
```

### `onDestroy`

Schedules a callback immediately before unmount. The only lifecycle hook that runs in server-side components.

```svelte
import { onDestroy } from 'svelte';

onDestroy(() => {
  console.log('destroying');
});
```

### `tick`

Returns a promise that resolves after pending state changes apply to the DOM, or in the next microtask if none pending. Use when you need "after update" behavior.

```svelte
import { tick } from 'svelte';

$effect.pre(() => {
  console.log('about to update');
  tick().then(() => console.log('just updated'));
});
```

### Deprecated: `beforeUpdate` / `afterUpdate`

Svelte 4 hooks shimmed in Svelte 5 for backwards compatibility but unavailable in rune-based components. Fired before/after every component update regardless of relevance.

```svelte
import { beforeUpdate, afterUpdate } from 'svelte';

beforeUpdate(() => console.log('about to update'));
afterUpdate(() => console.log('just updated'));
```

**Replacement:** Use `$effect.pre` instead of `beforeUpdate` and `$effect` instead of `afterUpdate`. These offer granular control—they only react to explicitly referenced state changes.

### Example: Auto-scrolling Chat Window

Old approach with `beforeUpdate` fires on every update (theme toggle, message addition), requiring manual checks:

```svelte
let updatingMessages = false;
let theme = $state('dark');
let messages = $state([]);
let viewport;

beforeUpdate(() => {
  if (!updatingMessages) return;
  const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
  if (autoscroll) {
    tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
  }
  updatingMessages = false;
});

function handleKeydown(event) {
  if (event.key === 'Enter') {
    updatingMessages = true;
    messages = [...messages, event.target.value];
    event.target.value = '';
  }
}

function toggle() {
  theme = theme === 'dark' ? 'light' : 'dark';
}
```

New approach with `$effect.pre` only runs when `messages` changes, not on theme toggle:

```svelte
let theme = $state('dark');
let messages = $state([]);
let viewport;

$effect.pre(() => {
  messages; // explicit dependency
  const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
  if (autoscroll) {
    tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
  }
});

function handleKeydown(event) {
  if (event.key === 'Enter') {
    messages = [...messages, event.target.value];
    event.target.value = '';
  }
}

function toggle() {
  theme = theme === 'dark' ? 'light' : 'dark';
}
```