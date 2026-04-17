## mount
Instantiates and mounts a component to a DOM element:
```js
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```
Multiple components can be mounted per page. Effects and `onMount` callbacks do not run during `mount` — use `flushSync()` to force them if needed.

## unmount
Removes a component created with `mount` or `hydrate`:
```js
import { unmount } from 'svelte';
unmount(app, { outro: true });
```
Returns a Promise that resolves after transitions complete (if `options.outro` is true) or immediately otherwise.

## render
Server-only function that renders a component to HTML strings:
```js
import { render } from 'svelte/server';
const result = render(App, { props: { some: 'property' } });
result.body; // HTML for <body>
result.head; // HTML for <head>
```

## hydrate
Like `mount`, but reuses HTML from server-side rendering and makes it interactive:
```js
import { hydrate } from 'svelte';
const app = hydrate(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```
Effects do not run during `hydrate` — use `flushSync()` afterwards if needed.