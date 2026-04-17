## Legacy Slots in Svelte 5

In Svelte 5 legacy mode, content passed to components is rendered using `<slot>` elements (as opposed to snippets and render tags in modern Svelte).

### Basic Slots

Content inside component tags becomes slotted content, rendered by the component:

```svelte
// App.svelte
<Modal>This is some slotted content</Modal>

// Modal.svelte
<div class="modal">
  <slot></slot>
</div>
```

To render a literal `<slot>` element, use `<svelte:element this={'slot'} />`.

### Named Slots

Components can have multiple named slots. Parent side uses `slot="name"` attribute:

```svelte
// App.svelte
<Modal>
  Default content
  <div slot="buttons">
    <button on:click={() => open = false}>close</button>
  </div>
</Modal>

// Modal.svelte
<div class="modal">
  <slot></slot>
  <hr>
  <slot name="buttons"></slot>
</div>
```

### Fallback Content

Slots can define fallback content rendered when no slotted content is provided:

```svelte
<slot>
  This will be rendered if no slotted content is provided
</slot>
```

### Passing Data to Slotted Content

Slots can pass values back to parent using props. Parent exposes values with `let:` directive:

```svelte
// FancyList.svelte
<ul>
  {#each items as data}
    <li class="fancy">
      <slot item={process(data)} />
    </li>
  {/each}
</ul>

// App.svelte
<FancyList {items} let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

Shorthand: `let:item` equals `let:item={item}`, and `<slot {item}>` equals `<slot item={item}>`.

Named slots can also expose values using `let:` on the element with the `slot` attribute:

```svelte
// FancyList.svelte
<ul>
  {#each items as item}
    <li class="fancy">
      <slot name="item" item={process(data)} />
    </li>
  {/each}
</ul>
<slot name="footer" />

// App.svelte
<FancyList {items}>
  <div slot="item" let:item>{item.text}</div>
  <p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```