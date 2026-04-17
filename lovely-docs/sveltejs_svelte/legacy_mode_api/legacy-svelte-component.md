In legacy mode, dynamic component rendering requires `<svelte:component>` to properly handle component instance recreation when the component reference changes.

**Behavior difference:**
- Runes mode: `<MyComponent>` automatically re-renders when `MyComponent` value changes
- Legacy mode: Must use `<svelte:component>` which destroys and recreates the component instance

**Usage:**
```svelte
<svelte:component this={MyComponent} />
```

If `this` is falsy, no component is rendered.

See the Svelte 5 migration guide for context on why this is no longer necessary in runes mode.