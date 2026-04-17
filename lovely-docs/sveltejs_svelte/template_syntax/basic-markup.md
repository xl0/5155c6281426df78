## Tags
Lowercase tags like `<div>` are HTML elements. Capitalized tags or dot-notation tags like `<Widget>` or `<my.stuff>` are components.

```svelte
<script>
	import Widget from './Widget.svelte';
</script>
<div>
	<Widget />
</div>
```

## Element attributes
Attributes work like HTML. Values can be unquoted, contain JavaScript expressions, or be pure expressions:

```svelte
<div class="foo">
	<button disabled>can't touch this</button>
</div>
<input type=checkbox />
<a href="page/{p}">page {p}</a>
<button disabled={!clickable}>...</button>
```

Boolean attributes are included if truthy, excluded if falsy. All other attributes are included unless nullish (`null` or `undefined`):

```svelte
<input required={false} placeholder="This input field is not required" />
<div title={null}>This div has no title attribute</div>
```

When attribute name and value match, use shorthand: `{name}` instead of `name={name}`:

```svelte
<button {disabled}>...</button>
```

## Component props
Values passed to components are called _props_ (not attributes). Use same shorthand as attributes:

```svelte
<Widget foo={bar} answer={42} text="hello" />
```

## Spread attributes
Multiple attributes/props can be spread at once. Order matters — later values override earlier ones:

```svelte
<Widget a="b" {...things} c="d" />
```

## Events
Listen to DOM events with `on` prefix attributes. Event attributes are case-sensitive (`onclick` vs `onClick`):

```svelte
<button onclick={() => console.log('clicked')}>click me</button>
<button {onclick}>click me</button>
<button {...thisSpreadContainsEventAttributes}>click me</button>
```

Event attributes fire after bindings. `ontouchstart` and `ontouchmove` are passive for performance. For preventing defaults on these, use the `on` function from `svelte/events` instead.

### Event delegation
Svelte delegates certain events to the application root for performance. When manually dispatching delegated events, set `{ bubbles: true }`. Avoid `stopPropagation` with `addEventListener` as it prevents reaching the root. Use `on` from `svelte/events` instead of `addEventListener` to preserve order and handle `stopPropagation` correctly.

Delegated events: `beforeinput`, `click`, `change`, `dblclick`, `contextmenu`, `focusin`, `focusout`, `input`, `keydown`, `keyup`, `mousedown`, `mousemove`, `mouseout`, `mouseover`, `mouseup`, `pointerdown`, `pointermove`, `pointerout`, `pointerover`, `pointerup`, `touchend`, `touchmove`, `touchstart`.

## Text expressions
JavaScript expressions in curly braces are rendered as text. `null` and `undefined` are omitted; others are coerced to strings:

```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>
<div>{(/^[A-Za-z ]+$/).test(value) ? x : y}</div>
```

Use HTML entities for literal braces: `&lbrace;` or `&#123;` for `{`, `&rbrace;` or `&#125;` for `}`.

Render HTML with `{@html}` tag (ensure string is escaped or controlled to prevent XSS):

```svelte
{@html potentiallyUnsafeHtmlString}
```

## Comments
HTML comments work normally:

```svelte
<!-- this is a comment! --><h1>Hello world</h1>
```

`svelte-ignore` comments disable warnings for the next block (usually accessibility):

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input bind:value={name} autofocus />
```

`@component` comments show on hover in other files and support markdown:

```svelte
<!--
@component
- You can use markdown here.
- Usage:
  ```html
  <Main name="Arethra">
  ```
-->
<script>
	let { name } = $props();
</script>
<main>
	<h1>Hello, {name}</h1>
</main>
```