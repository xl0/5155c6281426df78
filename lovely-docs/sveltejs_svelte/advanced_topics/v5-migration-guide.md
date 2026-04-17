## Reactivity Syntax Changes

**let → $state**: Variables are now explicitly reactive using the `$state` rune instead of implicit top-level reactivity.
```svelte
let count = $state(0);
```

**$: → $derived/$effect**: Reactive statements split into two runes:
- `$derived` for computed state: `const double = $derived(count * 2);`
- `$effect` for side effects: `$effect(() => { if (count > 5) alert('too high'); });`

**export let → $props**: Component properties use destructuring with `$props()`:
```svelte
let { optional = 'unset', required, class: klass, ...rest } = $props();
```
Handles renaming (via destructuring), rest props, and all props without special syntax.

## Event Changes

**on: directive → event attributes**: Event handlers are now properties without the colon:
```svelte
<button onclick={() => count++}>clicks: {count}</button>
// or with named function
function onclick() { count++; }
<button {onclick}>clicks: {count}</button>
```

**createEventDispatcher → callback props**: Components accept callback functions as props instead of emitting events:
```svelte
// Parent
<Pump inflate={(power) => { size += power; }} deflate={(power) => { size -= power; }} />

// Child
let { inflate, deflate } = $props();
<button onclick={() => inflate(power)}>inflate</button>
```

**Bubbling events**: Forward events via callback props:
```svelte
let { onclick } = $props();
<button {onclick}>click me</button>
```

**Event modifiers removed**: No `on:click|preventDefault`. Use wrapper functions or call methods directly:
```svelte
function once(fn) {
  return function (event) {
    if (fn) fn.call(this, event);
    fn = null;
  };
}
function preventDefault(fn) {
  return function (event) {
    event.preventDefault();
    fn.call(this, event);
  };
}
<button onclick={once(preventDefault(handler))}>...</button>
```

For `capture`, use `onclickcapture={...}`. For `passive`/`nonpassive`, use actions.

**Multiple event handlers**: Not allowed as duplicate attributes. Combine into one:
```svelte
<button onclick={(e) => { one(e); two(e); }}>...</button>
```

## Snippets Instead of Slots

**Default content**: Use `children` prop with `{@render children?.()}`:
```svelte
let { children } = $props();
{@render children?.()}
```

**Multiple placeholders**: Use named snippet props:
```svelte
let { header, main, footer } = $props();
<header>{@render header()}</header>
<main>{@render main()}</main>
<footer>{@render footer()}</footer>
```

**Passing data back up**: Snippets receive parameters:
```svelte
// Parent
<List items={['one', 'two', 'three']}>
  {#snippet item(text)}
    <span>{text}</span>
  {/snippet}
  {#snippet empty()}
    <span>No items yet</span>
  {/snippet}
</List>

// Child
let { items, item, empty } = $props();
{#if items.length}
  <ul>
    {#each items as entry}
      <li>{@render item(entry)}</li>
    {/each}
  </ul>
{:else}
  {@render empty?.()}
{/if}
```

## Migration Script

Run `npx sv migrate svelte-5` to automatically:
- Bump dependencies
- Migrate `let` → `$state`, `$:` → `$derived`/`$effect`
- Migrate `on:` → event attributes
- Migrate slots to snippets
- Migrate component instantiation

Manual cleanup needed for:
- `createEventDispatcher` (convert to callback props)
- `beforeUpdate`/`afterUpdate` (use `$effect.pre`/`$effect` + `tick`)
- `run` function from `svelte/legacy` (replace with `$effect`)
- Event modifier wrappers from `svelte/legacy`

## Components Are No Longer Classes

Use `mount`/`hydrate` instead of `new Component()`:
```svelte
import { mount } from 'svelte';
const app = mount(App, { target: document.getElementById("app") });
```

**Replacing class component methods**:
- `$on`: Use `events` option: `mount(App, { target, events: { event: callback } })`
- `$set`: Use `$state` object: `const props = $state({ foo: 'bar' }); mount(App, { target, props }); props.foo = 'baz';`
- `$destroy`: Use `unmount(app)`

**Fallback**: Use `createClassComponent` from `svelte/legacy` or set `compatibility.componentApi: 4` compiler option.

**Server-side rendering**: Use `render` function:
```svelte
import { render } from 'svelte/server';
const { html, head } = render(App, { props: { message: 'hello' }});
```

**Component typing**: Use `Component` type instead of `SvelteComponent`:
```ts
import type { Component } from 'svelte';
let C: Component<{ foo: string }> = $state(Math.random() ? ComponentA : ComponentB);
```

## Other Changes

**`<svelte:component>` no longer needed**: Components are now dynamic by default:
```svelte
let Thing = $state();
<Thing /> <!-- equivalent to <svelte:component this={Thing} /> -->
```

**Dot notation for components**: `<foo.bar>` now creates a component, not an element.

**Whitespace handling simplified**: Whitespace between nodes collapses to one, whitespace at tag start/end removed. Use `preserveWhitespace` option to disable.

**Modern browser required**: Uses Proxies, ResizeObserver, no IE support. `legacy` compiler option removed.

**Compiler option changes**: Removed `false`/`true`/`"none"` from `css`, removed `hydratable`, `enableSourcemap`, `tag`, `loopGuardTimeout`, `format`, `sveltePath`, `errorMode`, `varsReport`.

**`children` prop reserved**: Cannot have separate prop with this name.

## Breaking Changes in Runes Mode

**Bindings to component exports not allowed**: Use `bind:this` instead: `<A bind:this={a} />` then access `a.foo`.

**Bindings require `$bindable()`**: Properties not bindable by default:
```svelte
let { foo = $bindable('bar') } = $props();
```

**`accessors` option ignored**: Use component exports instead:
```svelte
let { name } = $props();
export const getName = () => name;
```

**`immutable` option ignored**: Replaced by `$state` behavior.

**Classes not auto-reactive**: Define reactive fields with `$state` on the class.

**Touch/wheel events passive**: `onwheel`, `onmousewheel`, `ontouchstart`, `ontouchmove` are passive by default. Use `on` action to prevent defaults.

**Stricter attribute syntax**: Complex values must be quoted: `<Component prop="this{is}valid" />`.

**Stricter HTML structure**: Browser auto-repair no longer allowed; compiler throws error.

**`@const` assignment validation stricter**: Destructured assignments to `@const` parts not allowed.

**`:is()`, `:has()`, `:where()` scoped**: Use `:global()` inside them if needed.

**CSS hash position non-deterministic**: No longer always last.

**Scoped CSS uses `:where()`**: Selectors use `:where(.svelte-xyz123)` for specificity control.

**Error/warning codes renamed**: Use underscores instead of dashes (e.g., `foo_bar`).

**Reduced namespaces**: Only `html`, `mathml`, `svg` valid.

**`beforeUpdate`/`afterUpdate` changes**: No longer runs twice on initial render if modifying template variables. Parent `afterUpdate` runs after child. Don't run when slot content updates. Disallowed in runes mode.

**`contenteditable` binding behavior**: Binding takes full control; reactive values inside won't update.

**`oneventname` attributes no longer accept strings**: `<button onclick="alert('hello')">` invalid.

**`null`/`undefined` become empty string**: Instead of printing as strings.

**`bind:files` stricter**: Only accepts `null`, `undefined`, or `FileList`.

**Bindings react to form resets**: Reset listeners placed on document.

**`walk` not exported**: Import from `estree-walker` directly.

**`<svelte:options>` content forbidden**: Compiler error if content inside.

**`<slot>` in shadow roots preserved**: Not replaced in `<template shadowrootmode="...">`.

**`<svelte:element this="...">` must be expression**: `<svelte:element this="div">` invalid; use `<svelte:element this={"div"}>`.

**`mount` plays transitions by default**: Unless `intro: false` option set.

**`<img src={...}>` and `{@html ...}` hydration mismatches not repaired**: Warns in dev but doesn't fix. Force update by toggling values in `$effect`.

**Hydration uses comments**: Don't remove comments from server-rendered HTML. Manually authored HTML needs comments at correct positions.

**`onevent` attributes delegated**: Don't manually stop propagation on delegated events.

**`--style-props` uses `<svelte-css-wrapper>`**: Instead of `<div>`.