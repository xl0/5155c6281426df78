## Compiling to Custom Elements

Svelte components can be compiled to web components using the `customElement: true` compiler option. Specify a tag name with `<svelte:options customElement="my-element">`.

```svelte
<svelte:options customElement="my-element" />
<script>
	let { name = 'world' } = $props();
</script>
<h1>Hello {name}!</h1>
<slot />
```

Inner components without a tag name remain regular Svelte components. The static `element` property contains the custom element constructor:

```js
import MyElement from './MyElement.svelte';
customElements.define('my-element', MyElement.element);
```

Once defined, use as regular DOM elements:

```js
document.body.innerHTML = `<my-element><p>Slotted content</p></my-element>`;
const el = document.querySelector('my-element');
console.log(el.name);
el.name = 'everybody';
```

All props must be explicitly declared—`let props = $props()` without declaring `props` in component options won't expose properties on the DOM element.

## Lifecycle

Custom elements wrap Svelte components. The inner component is created in the next tick after `connectedCallback`, not immediately. Properties assigned before DOM insertion are saved and applied on creation. Exported functions are only available after mounting; use the `extend` option to work around this. Shadow DOM updates happen in the next tick, allowing batching and preventing unmounting during DOM moves. The component is destroyed in the next tick after `disconnectedCallback`.

## Component Options

Define `customElement` as an object in `<svelte:options>` (Svelte 4+):

```svelte
<svelte:options
	customElement={{
		tag: 'custom-element',
		shadow: 'none',
		props: {
			name: { reflect: true, type: 'Number', attribute: 'element-index' }
		},
		extend: (customElementConstructor) => {
			return class extends customElementConstructor {
				static formAssociated = true;
				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
				}
				randomIndex() {
					this.elementIndex = Math.random();
				}
			};
		}
	}}
/>
<script>
	let { elementIndex, attachedInternals } = $props();
	function check() {
		attachedInternals.checkValidity();
	}
</script>
```

Options:
- `tag: string`: Custom element tag name; auto-registers if set
- `shadow: "none"`: Disable shadow root (styles not encapsulated, slots unavailable)
- `props`: Modify property behavior per prop:
  - `attribute: string`: Custom attribute name (default: lowercase property name)
  - `reflect: boolean`: Reflect prop changes back to DOM (default: false)
  - `type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'`: Type for attribute-to-prop conversion (default: String)
- `extend: function`: Receives custom element class, returns modified class for lifecycle customization or ElementInternals integration

TypeScript in `extend` requires `lang="ts"` on a script and only erasable syntax.

## Caveats

- Styles are encapsulated (unless `shadow: "none"`); global styles and `:global()` don't apply
- Styles are inlined as JavaScript strings, not extracted to .css
- Not suitable for server-side rendering (shadow DOM invisible until JS loads)
- Slotted content renders eagerly in DOM (always created even in `{#if}` blocks), unlike Svelte's lazy rendering
- `<slot>` in `{#each}` doesn't repeat slotted content
- `let:` directive has no effect
- Older browsers need polyfills
- Context feature works within custom elements but not across them
- Don't declare properties/attributes starting with `on` (interpreted as event listeners: `oneworld={true}` becomes `addEventListener('eworld', true)`)