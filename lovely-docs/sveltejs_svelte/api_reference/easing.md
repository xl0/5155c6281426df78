The `svelte/easing` module provides 32 easing functions for animations and transitions. Each function takes a normalized time value `t` (typically 0 to 1) and returns an eased value.

Available easing functions:
- **Linear**: `linear` - constant rate
- **Quadratic**: `quadIn`, `quadOut`, `quadInOut`
- **Cubic**: `cubicIn`, `cubicOut`, `cubicInOut`
- **Quartic**: `quartIn`, `quartOut`, `quartInOut`
- **Quintic**: `quintIn`, `quintOut`, `quintInOut`
- **Sine**: `sineIn`, `sineOut`, `sineInOut`
- **Exponential**: `expoIn`, `expoOut`, `expoInOut`
- **Circular**: `circIn`, `circOut`, `circInOut`
- **Back**: `backIn`, `backOut`, `backInOut`
- **Bounce**: `bounceIn`, `bounceOut`, `bounceInOut`
- **Elastic**: `elasticIn`, `elasticOut`, `elasticInOut`

Each easing function follows the pattern: `In` (slow start), `Out` (slow end), `InOut` (slow start and end).

Import example:
```js
import { cubicIn, bounceOut, linear } from 'svelte/easing';
```

Use in animations/transitions by passing the easing function to control how values change over time.