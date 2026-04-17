## Error Reference

### invalid_default_snippet
Cannot use `{@render children(...)}` if parent uses `let:` directives. Use named snippets instead.

```svelte
// Parent.svelte - WRONG
<List {items} let:entry>
    <span>{entry}</span>
</List>

// List.svelte
<script>
    let { items, children } = $props();
</script>
<ul>
    {#each items as item}
        <li>{@render children(item)}</li>
    {/each}
</ul>
```

The `let:` directive and `{@render children()}` are incompatible APIs.

### invalid_snippet_arguments
A snippet function was passed invalid arguments. Snippets should only be instantiated via `{@render ...}`.

### lifecycle_outside_component
`%name%(...)` can only be used during component initialisation. Must be invoked at the top level of the instance script.

```svelte
<script>
    import { onMount } from 'svelte';

    // WRONG
    function handleClick() {
        onMount(() => {})
    }

    // CORRECT
    onMount(() => {})
</script>
```

### missing_context
Context was not set in a parent component. The `createContext()` utility returns `[get, set]` pair; `get` throws if `set` wasn't called in a parent.

### snippet_without_render_tag
Attempted to render a snippet without `{@render}` block, causing stringification instead of DOM rendering.

```svelte
// WRONG - children not rendered
<script>
    let { children } = $props();
</script>
{children}

// WRONG - parent passes snippet where non-snippet expected
// Parent.svelte
<ChildComponent>
  {#snippet label()}
    <span>Hi!</span>
  {/snippet}
</ChildComponent>

// Child.svelte
<script>
  let { label } = $props();
</script>
<p>{label}</p>

// CORRECT
<p>{@render label()}</p>
```

### store_invalid_shape
`%name%` is not a store with a `subscribe` method.

### svelte_element_invalid_this_value
The `this` prop on `<svelte:element>` must be a string, if defined.