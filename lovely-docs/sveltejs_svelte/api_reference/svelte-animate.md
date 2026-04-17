## flip

The `flip` function animates element position changes using the FLIP technique (First, Last, Invert, Play). It calculates start and end positions of an element and animates between them by translating x and y values.

```js
import { flip } from 'svelte/animate';

function flip(
  node: Element,
  { from, to }: { from: DOMRect; to: DOMRect },
  params?: FlipParams
): AnimationConfig;
```

## AnimationConfig

Configuration object returned by animation functions with properties:
- `delay?: number` - delay before animation starts
- `duration?: number` - animation duration in milliseconds
- `easing?: (t: number) => number` - easing function
- `css?: (t: number, u: number) => string` - returns CSS to apply at each frame
- `tick?: (t: number, u: number) => void` - callback invoked at each frame

## FlipParams

Parameters for the `flip` function:
- `delay?: number` - delay before animation starts
- `duration?: number | ((len: number) => number)` - duration in ms or function that calculates it from distance
- `easing?: (t: number) => number` - easing function