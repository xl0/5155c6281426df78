## Overview
The `svelte/reactivity/window` module exports reactive versions of window and navigator properties. Each export has a reactive `current` property that updates automatically and can be used in templates, deriveds, and effects without manual event listeners.

## Available Exports (all since 5.11.0)

- **devicePixelRatio**: Reactive view of `window.devicePixelRatio` (undefined on server). Browser behavior varies: Chrome responds to zoom level, Firefox and Safari don't.
- **innerHeight**: Reactive view of `window.innerHeight` (undefined on server)
- **innerWidth**: Reactive view of `window.innerWidth` (undefined on server)
- **online**: Reactive view of `navigator.onLine` (undefined on server)
- **outerHeight**: Reactive view of `window.outerHeight` (undefined on server)
- **outerWidth**: Reactive view of `window.outerWidth` (undefined on server)
- **screenLeft**: Reactive view of `window.screenLeft`, updated in `requestAnimationFrame` callback (undefined on server)
- **screenTop**: Reactive view of `window.screenTop`, updated in `requestAnimationFrame` callback (undefined on server)
- **scrollX**: Reactive view of `window.scrollX` (undefined on server)
- **scrollY**: Reactive view of `window.scrollY` (undefined on server)

## Example
```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>

<p>{innerWidth.current}x{innerHeight.current}</p>
```