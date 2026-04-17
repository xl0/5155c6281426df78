Reference documentation for Svelte client-side warnings. Each warning explains a potential issue and how to fix it.

**assignment_value_stale**: Assignment operators like `??=` evaluate to the right-hand side value, not the final state value. This can cause unexpected behavior when chaining operations. Fix by separating into two statements:
```js
object.array ??= [];
object.array.push(object.array.length);
```

**await_reactivity_loss**: State read in async functions after an `await` may not be tracked for reactivity. Pass values as function parameters instead of reading them inside the async function:
```js
async function sum(a, b) { return await a + b; }
let total = $derived(await sum(a, b));
```

**await_waterfall**: Multiple `$derived(await ...)` expressions create unnecessary waterfalls where the second waits for the first to resolve. Create promises first, then await them:
```js
let aPromise = $derived(one());
let bPromise = $derived(two());
let a = $derived(await aPromise);
let b = $derived(await bPromise);
```

**binding_property_non_reactive**: Binding to a non-reactive property.

**console_log_state**: Logging `$state` proxies shows the proxy object, not the value. Use `$inspect(...)` or `$state.snapshot(...)` instead.

**event_handler_invalid**: Event handler is not a function.

**hydration_attribute_changed**: Certain attributes like `src` on `<img>` won't update during hydration. Ensure values match between server and client, or force an update in an `$effect`:
```svelte
<script>
  let { src } = $props();
  if (typeof window !== 'undefined') {
    const initial = src;
    src = undefined;
    $effect(() => { src = initial; });
  }
</script>
<img {src} />
```

**hydration_html_changed**: `{@html ...}` values that differ between server and client won't update during hydration. Use the same pattern as hydration_attribute_changed.

**hydration_mismatch**: Server-rendered HTML structure doesn't match client expectations. Usually caused by invalid HTML that the DOM repairs.

**invalid_raw_snippet_render**: `createRawSnippet` render function must return HTML for a single element.

**legacy_recursive_reactive_block**: Migrated `$:` reactive blocks that both read and update the same value may cause recursive updates when converted to `$effect`.

**lifecycle_double_unmount**: Attempted to unmount a component that wasn't mounted.

**ownership_invalid_binding**: Parent component didn't declare a binding that child is trying to bind to. Use `bind:` in parent instead of just passing the property:
```svelte
<!-- GrandParent -->
<Parent bind:value />
<!-- instead of -->
<Parent {value} />
```

**ownership_invalid_mutation**: Mutating unbound props is discouraged. Use `bind:` or callbacks instead, or mark the prop as `$bindable`:
```svelte
<!-- App.svelte -->
<Child bind:person />
<!-- or in Child.svelte -->
<script>
  let { person = $bindable() } = $props();
</script>
```

**select_multiple_invalid_value**: `<select multiple>` value must be an array, null, or undefined.

**state_proxy_equality_mismatch**: `$state(...)` creates a proxy with different identity than the original value, so equality checks fail. Compare values where both or neither are created with `$state(...)`.

**state_proxy_unmount**: `unmount()` was called with a `$state` proxy instead of a component. Use `$state.raw()` if the component needs to be reactive.

**svelte_boundary_reset_noop**: `<svelte:boundary>` reset function only works the first time it's called. Don't store a reference to it outside the boundary.

**transition_slide_display**: The `slide` transition animates height and doesn't work with `display: inline`, `inline-*`, `table`, `table-*`, or `contents`.