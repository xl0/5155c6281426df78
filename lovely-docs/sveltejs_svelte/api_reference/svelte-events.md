## on

Attaches an event handler to DOM elements (window, document, HTMLElement, MediaQueryList, or generic EventTarget) and returns a function that removes the handler.

Unlike `addEventListener`, using `on()` preserves the correct handler execution order relative to declaratively-added handlers (like `onclick` attributes), which use event delegation for performance.

**Signature:**
```js
import { on } from 'svelte/events';

// Attach to window
on(window, 'click', (event) => { /* ... */ }, options);

// Attach to document
on(document, 'scroll', (event) => { /* ... */ }, options);

// Attach to element
on(element, 'input', (event) => { /* ... */ }, options);

// Attach to MediaQueryList
on(mediaQueryList, 'change', (event) => { /* ... */ }, options);

// Generic EventTarget
on(eventTarget, 'custom', (event) => { /* ... */ }, options);
```

All overloads return a function that removes the handler when called. The `handler` receives the target as `this` context and the event object. Optional `AddEventListenerOptions` can be passed for capture, once, passive, etc.