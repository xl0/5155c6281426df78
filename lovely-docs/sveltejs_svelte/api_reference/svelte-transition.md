## Transition Functions

Seven built-in transition functions for animating element entry/exit:

- **blur**: Animates blur filter and opacity. Parameters: `delay`, `duration`, `easing`, `amount` (number|string), `opacity` (number)
- **fade**: Animates opacity from 0 to current (in) or current to 0 (out). Parameters: `delay`, `duration`, `easing`
- **fly**: Animates x, y position and opacity. Parameters: `delay`, `duration`, `easing`, `x` (number|string), `y` (number|string), `opacity`
- **scale**: Animates opacity and scale. Parameters: `delay`, `duration`, `easing`, `start` (number), `opacity`
- **slide**: Slides element in/out. Parameters: `delay`, `duration`, `easing`, `axis` ('x'|'y')
- **draw**: Animates SVG stroke like drawing. Works with elements having `getTotalLength()` method. Parameters: `delay`, `speed`, `duration` (number|function), `easing`
- **crossfade**: Creates paired `send`/`receive` transitions that morph elements between positions with fade. Returns tuple of two functions. Parameters: `delay`, `duration` (number|function), `easing`, `fallback` (optional custom transition)

All functions return `TransitionConfig` with optional `delay`, `duration`, `easing`, `css` (function), `tick` (function).

Import: `import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition'`