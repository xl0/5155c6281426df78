## Svelte 3/4 Component API (Legacy)

This documents the imperative component API for Svelte 3 and 4. In Svelte 5, use `mount()` and `unmount()` instead.

### Creating a Component

Client-side components are JavaScript classes compiled with `generate: 'dom'`:

```ts
import App from './App.svelte';
const app = new App({
  target: document.body,
  props: { answer: 42 },
  anchor: null,
  context: new Map(),
  hydrate: false,
  intro: false
});
```

- `target` (required): HTMLElement or ShadowRoot to render into
- `anchor`: child of target to render before
- `props`: object of properties
- `context`: Map of root-level context key-value pairs
- `hydrate`: upgrade existing DOM from server-side rendering (requires `hydratable: true` compiler option)
- `intro`: play transitions on initial render

Hydration example:
```ts
const app = new App({
  target: document.querySelector('#server-rendered-html'),
  hydrate: true
});
```

### `$set(props)`

Programmatically set props. Schedules update for next microtask (async):
```ts
component.$set({ answer: 42 });
```

In Svelte 5+, use `$state` instead:
```ts
let props = $state({ answer: 42 });
const component = mount(Component, { props });
props.answer = 24;
```

### `$on(event, callback)`

Listen to component events. Returns function to remove listener:
```ts
const off = component.$on('selected', (event) => {
  console.log(event.detail.selection);
});
off();
```

In Svelte 5+, pass callback props instead.

### `$destroy()`

Remove component from DOM and trigger `onDestroy` handlers:
```ts
component.$destroy();
```

In Svelte 5+, use `unmount()` instead.

### Component Props (with `accessors: true`)

If compiled with `accessors: true`, each prop has getter/setter for synchronous updates:
```ts
console.log(component.count);
component.count += 1;
```

In Svelte 5+, `export` props instead.

### Server-side Component API

Server-side components expose `render(props, options)` returning `{ head, html, css }`:

```ts
require('svelte/register');
const App = require('./App.svelte').default;

const { head, html, css } = App.render(
  { answer: 42 },
  { context: new Map([['key', 'value']]) }
);
```

In Svelte 5+, use `render()` from `svelte-server` instead.