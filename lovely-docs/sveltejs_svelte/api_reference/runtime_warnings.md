## Client Warnings

**assignment_value_stale**: Assignment operators like `??=` evaluate to the right-hand side value, not the final state value. Fix by separating into two statements:
```js
object.array ??= [];
object.array.push(object.array.length);
```

**await_reactivity_loss**: State read after `await` in async functions may not be tracked. Pass values as function parameters:
```js
async function sum(a, b) { return await a + b; }
let total = $derived(await sum(a, b));
```

**await_waterfall**: Sequential `$derived(await ...)` creates unnecessary waterfalls. Create promises first, then await:
```js
let aPromise = $derived(one());
let bPromise = $derived(two());
let a = $derived(await aPromise);
let b = $derived(await bPromise);
```

**binding_property_non_reactive**: Binding to non-reactive properties.

**console_log_state**: Logging `$state` proxies shows proxy internals. Use `$inspect()` or `$state.snapshot()` instead.

**event_handler_invalid**: Event handler is not a function.

**hydration_attribute_changed**: Attributes like `src` on `<img>` won't update during hydration. Use `svelte-ignore` or force update via `$effect`:
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

**hydration_html_changed**: `{@html}` block values that differ between server/client won't update. Use same pattern as hydration_attribute_changed.

**hydration_mismatch**: Server HTML structure doesn't match client DOM. Check for invalid HTML that the DOM auto-repairs.

**invalid_raw_snippet_render**: `createRawSnippet` render function must return HTML for a single element.

**legacy_recursive_reactive_block**: Migrated `$:` blocks that access and update the same value may cause recursive updates when converted to `$effect`.

**lifecycle_double_unmount**: Attempted to unmount a component that wasn't mounted.

**ownership_invalid_binding**: Parent component didn't declare binding. Use `bind:` instead of property passing:
```svelte
<!-- GrandParent -->
<Parent bind:value />
<!-- instead of -->
<Parent {value} />
```

**ownership_invalid_mutation**: Mutating unbound props is discouraged. Use `$bindable` or callbacks:
```svelte
<!-- App.svelte -->
<Child {person} />
<!-- Child.svelte -->
<script>
	let { person } = $props();
</script>
<input bind:value={person.name}>
```
Fix: Mark `person` as `$bindable` in App or use callbacks.

**select_multiple_invalid_value**: `<select multiple value={...}>` requires array value, not other types.

**state_proxy_equality_mismatch**: `$state()` creates proxies with different identity than original values. Comparisons fail:
```js
let value = { foo: 'bar' };
let proxy = $state(value);
value === proxy; // always false
```
Compare values where both/neither use `$state()`.

**state_proxy_unmount**: Don't pass `$state` proxy to `unmount()`. Use `$state.raw()` if reactivity needed.

**svelte_boundary_reset_noop**: `<svelte:boundary>` reset function only works once. Don't store reference outside boundary.

**transition_slide_display**: `slide` transition requires `display: block/flex/grid`. Doesn't work with `inline`, `table`, or `contents`.

## Shared Warnings

**dynamic_void_element_content**: Void elements like `<input>` cannot have content.

**state_snapshot_uncloneable**: `$state.snapshot()` cannot clone certain objects (DOM elements, etc.). Original value returned for uncloneable properties.