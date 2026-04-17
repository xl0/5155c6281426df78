## createAttachmentKey

Creates a symbol key for programmatic attachment creation. When spread onto an element, the symbol key is recognized as an attachment—an alternative to `{@attach ...}` syntax.

```js
import { createAttachmentKey } from 'svelte/attachments';

const props = {
  class: 'cool',
  onclick: () => alert('clicked'),
  [createAttachmentKey()]: (node) => {
    node.textContent = 'attached!';
  }
};
```

```dts
function createAttachmentKey(): symbol;
```

## fromAction

Converts an action into an attachment with identical behavior. The second argument must be a function that returns the action's argument, not the argument itself.

```js
import { fromAction } from 'svelte/attachments';

// with an action
<div use:foo={bar}>...</div>

// with an attachment
<div {@attach fromAction(foo, () => bar)}>...</div>
```

```dts
function fromAction<E extends EventTarget, T extends unknown>(
  action: Action<E, T> | ((element: E, arg: T) => void | ActionReturn<T>),
  fn: () => T
): Attachment<E>;

function fromAction<E extends EventTarget>(
  action: Action<E, void> | ((element: E) => void | ActionReturn<void>)
): Attachment<E>;
```

## Attachment

A function that runs when an element mounts to the DOM and optionally returns a cleanup function called on unmount. Can be attached via `{@attach ...}` or by spreading an object with a property created by `createAttachmentKey`.

```dts
interface Attachment<T extends EventTarget = Element> {
  (element: T): void | (() => void);
}
```