## render

Server-side only function for rendering Svelte components. Only available when compiling with the `server` option.

Takes a component and returns an object with `body` and `head` properties for populating HTML during server-rendering.

```js
import { render } from 'svelte/server';

const { body, head } = render(MyComponent, {
  props: { /* component props */ },
  context: new Map(),
  idPrefix: 'svelte-'
});
```

**Function signature:**
- `component`: A Svelte component (either SvelteComponent or Component type)
- `options` (optional if component has no required props):
  - `props`: Component props (excludes `$$slots` and `$$events`)
  - `context`: Optional Map for passing context values
  - `idPrefix`: Optional string prefix for generated IDs
- Returns: `RenderOutput` with `body` and `head` properties