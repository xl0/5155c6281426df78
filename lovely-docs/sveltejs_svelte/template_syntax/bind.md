## Two-way data binding directive

The `bind:` directive enables data to flow from child to parent (opposite of normal downward flow). Syntax: `bind:property={expression}` where expression is an lvalue. Can omit expression if it matches property name: `bind:value` equals `bind:value={value}`.

Svelte creates event listeners that update bound values. Most bindings are two-way (changes affect both element and value); some are readonly (value changes don't affect element).

### Function bindings
Use `bind:property={get, set}` with getter/setter functions for validation/transformation:
```svelte
<input bind:value={() => value, (v) => value = v.toLowerCase()} />
```
For readonly bindings, set get to `null`:
```svelte
<div bind:clientWidth={null, redraw} bind:clientHeight={null, redraw}>...</div>
```
Available in Svelte 5.9.0+.

### Input bindings

**`bind:value`** - binds input's value property. Numeric inputs (type="number" or type="range") coerce to number:
```svelte
<script>
	let a = $state(1);
	let b = $state(2);
</script>
<input type="number" bind:value={a} min="0" max="10" />
<input type="range" bind:value={a} min="0" max="10" />
<p>{a} + {b} = {a + b}</p>
```
Empty/invalid numeric inputs become `undefined`. Since 5.6.0, inputs with `defaultValue` in forms revert to that on reset (binding takes precedence unless null/undefined).

**`bind:checked`** - checkbox binding:
```svelte
<input type="checkbox" bind:checked={accepted} />
```
Since 5.6.0, `defaultChecked` attribute reverts on form reset.

**`bind:indeterminate`** - independent of checked state:
```svelte
<input type="checkbox" bind:checked bind:indeterminate>
{#if indeterminate}
	waiting...
{:else if checked}
	checked
{:else}
	unchecked
{/if}
```

**`bind:group`** - groups radio/checkbox inputs:
```svelte
<script>
	let tortilla = $state('Plain');
	let fillings = $state([]);
</script>
<!-- radio inputs are mutually exclusive -->
<label><input type="radio" bind:group={tortilla} value="Plain" /> Plain</label>
<label><input type="radio" bind:group={tortilla} value="Whole wheat" /> Whole wheat</label>
<!-- checkbox inputs populate array -->
<label><input type="checkbox" bind:group={fillings} value="Rice" /> Rice</label>
<label><input type="checkbox" bind:group={fillings} value="Beans" /> Beans</label>
```
Only works if inputs are in same component.

**`bind:files`** - file input binding returns FileList. Update programmatically using DataTransfer:
```svelte
<script>
	let files = $state();
	function clear() {
		files = new DataTransfer().files;
	}
</script>
<input accept="image/png, image/jpeg" bind:files type="file" />
<button onclick={clear}>clear</button>
```
FileList objects are immutable; create new DataTransfer to modify.

### Select bindings

**`bind:value`** - binds to selected option's value (can be any type, not just strings):
```svelte
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b}>b</option>
</select>
```

**`<select multiple>`** - bound variable is array of selected option values:
```svelte
<select multiple bind:value={fillings}>
	<option>Rice</option>
	<option>Beans</option>
	<option>Cheese</option>
</select>
```
When option value matches text content, value attribute can be omitted. Use `selected` attribute for default selection; binding takes precedence if not `undefined`. Reverts to selected option on form reset.

### Media element bindings

**`<audio>` and `<video>`** two-way bindings:
- `currentTime`, `playbackRate`, `paused`, `volume`, `muted`

Readonly bindings:
- `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

Video-only readonly: `videoWidth`, `videoHeight`

```svelte
<audio src={clip} bind:duration bind:currentTime bind:paused></audio>
```

### Image bindings

**`<img>`** readonly bindings:
- `naturalWidth`, `naturalHeight`

### Details binding

**`<details bind:open>`** - binds to open property:
```svelte
<details bind:open={isOpen}>
	<summary>How do you comfort a JavaScript bug?</summary>
	<p>You console it.</p>
</details>
```

### Contenteditable bindings

Elements with `contenteditable` support:
- `innerHTML`, `innerText`, `textContent`

```svelte
<div contenteditable="true" bind:innerHTML={html}></div>
```

### Dimension bindings

All visible elements have readonly bindings (measured with ResizeObserver):
- `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`
- `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`

```svelte
<div bind:offsetWidth={width} bind:offsetHeight={height}>
	<Chart {width} {height} />
</div>
```
`display: inline` elements have no dimensions and can't be observed; change to `inline-block`. CSS transforms don't trigger ResizeObserver.

### bind:this

Get reference to DOM node (undefined until mounted, read in effects/handlers, not during init):
```svelte
<script>
	let canvas;
	$effect(() => {
		const ctx = canvas.getContext('2d');
		drawStuff(ctx);
	});
</script>
<canvas bind:this={canvas}></canvas>
```

Works with components too:
```svelte
<!-- App.svelte -->
<ShoppingCart bind:this={cart} />
<button onclick={() => cart.empty()}>Empty shopping cart</button>

<!-- ShoppingCart.svelte -->
<script>
	export function empty() { }
</script>
```

### Component property binding

Bind to component props with same syntax as elements:
```svelte
<Keypad bind:value={pin} />
```
Mark properties as bindable using `$bindable()` rune:
```svelte
<script>
	let { readonlyProperty, bindableProperty = $bindable() } = $props();
</script>
```
Bindable properties can have fallback values (only apply when not bound):
```svelte
<script>
	let { bindableProperty = $bindable('fallback value') } = $props();
</script>
```
When bound with fallback, parent must provide non-undefined value or runtime error thrown.