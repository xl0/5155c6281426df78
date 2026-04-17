## `<svelte:document>` Element

Allows you to add event listeners to `document` and use actions on it, similar to `<svelte:window>`.

**Usage:**
```svelte
<svelte:document onevent={handler} />
<svelte:document bind:prop={value} />
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

**Constraints:**
- May only appear at the top level of your component
- Must never be inside a block or element

**Bindable Properties (readonly):**
- `activeElement`
- `fullscreenElement`
- `pointerLockElement`
- `visibilityState`

**Use Cases:**
Listen to document events like `visibilitychange` that don't fire on `window`, and bind to document properties.