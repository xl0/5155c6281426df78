## Spring

A class wrapper for values that animate with spring physics. Available since 5.8.0.

```js
import { Spring } from 'svelte/motion';
const spring = new Spring(0);
spring.target = 100; // animates current towards target
```

Properties: `target` (end value), `current` (getter for current value), `stiffness`, `damping`, `precision`.

Methods:
- `constructor(value, options?)` - create spring
- `static of(fn, options?)` - bind spring to function return value (must be in effect root)
- `set(value, options?)` - set target and return promise when current catches up. Options: `instant` (jump immediately), `preserveMomentum` (continue trajectory for N ms, useful for fling gestures)

## Tween

A class wrapper for values that smoothly animate to target. Available since 5.8.0.

```js
import { Tween } from 'svelte/motion';
const tween = new Tween(0);
tween.target = 100; // animates current towards target over duration
```

Properties: `target` (getter/setter), `current` (getter).

Methods:
- `constructor(value, options?)` - create tween with delay, duration, easing options
- `static of(fn, options?)` - bind tween to function return value (must be in effect root)
- `set(value, options?)` - set target and return promise when current catches up. Options override defaults.

## prefersReducedMotion

A media query that matches user's prefers-reduced-motion setting (available since 5.7.0).

```js
import { prefersReducedMotion } from 'svelte/motion';
import { fly } from 'svelte/transition';

let visible = $state(false);
```

```svelte
{#if visible}
	<p transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}>
		flies in, unless user prefers reduced motion
	</p>
{/if}
```

## Legacy APIs (deprecated)

`spring(value?, opts?)` - function that returns Spring store (use Spring class instead)

`tweened(value?, defaults?)` - function that returns Tweened store (use Tween class instead)

Legacy Spring store interface extends Readable and has `set()`, `update()`, `subscribe()` methods plus `precision`, `damping`, `stiffness` properties.

Legacy Tweened store interface extends Readable and has `set()`, `update()` methods.