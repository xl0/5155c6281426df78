## Overview
The `svelte/legacy` module provides deprecated functions for migrating from Svelte 4 to Svelte 5. All imports are marked as deprecated and should be migrated away from over time.

## Component Migration Functions

**asClassComponent** - Converts a Svelte 5 component function to a Svelte 4 compatible component constructor:
```js
import { asClassComponent } from 'svelte/legacy';
const LegacyComponent = asClassComponent(MyComponent);
```

**createClassComponent** - Creates a Svelte 4 compatible component from options and a component function:
```js
import { createClassComponent } from 'svelte/legacy';
const component = createClassComponent({
  component: MyComponent,
  props: { /* ... */ }
});
```

**createBubbler** - Creates a `bubble` function that mimics Svelte 4's automatic event delegation:
```js
import { createBubbler } from 'svelte/legacy';
const bubble = createBubbler();
const clickHandler = bubble('click');
```

## Event Modifier Substitutes

Since Svelte 5 removed event modifiers, these functions provide replacements:

**once** - Executes handler only once:
```js
import { once } from 'svelte/legacy';
const handler = once((event) => { /* ... */ });
```

**preventDefault** - Calls `event.preventDefault()` before handler:
```js
import { preventDefault } from 'svelte/legacy';
const handler = preventDefault((event) => { /* ... */ });
```

**stopPropagation** - Calls `event.stopPropagation()` before handler:
```js
import { stopPropagation } from 'svelte/legacy';
const handler = stopPropagation((event) => { /* ... */ });
```

**stopImmediatePropagation** - Calls `event.stopImmediatePropagation()` before handler:
```js
import { stopImmediatePropagation } from 'svelte/legacy';
const handler = stopImmediatePropagation((event) => { /* ... */ });
```

**self** - Only executes if `event.target === node`:
```js
import { self } from 'svelte/legacy';
const handler = self((event) => { /* ... */ });
```

**trusted** - Only executes if `event.isTrusted === true`:
```js
import { trusted } from 'svelte/legacy';
const handler = trusted((event) => { /* ... */ });
```

## Event Modifier Actions

**passive** - Action to apply passive event listener:
```js
import { passive } from 'svelte/legacy';
<button use:passive={['click', handler]}>Click</button>
```

**nonpassive** - Action to apply non-passive event listener:
```js
import { nonpassive } from 'svelte/legacy';
<button use:nonpassive={['click', handler]}>Click</button>
```

## Utility Functions

**handlers** - Combines multiple event listeners into one:
```js
import { handlers } from 'svelte/legacy';
const combined = handlers(handler1, handler2, handler3);
```

**run** - Executes function immediately on server, works like `$effect.pre` on client:
```js
import { run } from 'svelte/legacy';
run(() => { /* initialization code */ });
```

## Types

**LegacyComponentType** - Type supporting dual class/function component usage during transition period.