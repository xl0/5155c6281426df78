## Client Errors

**async_derived_orphan**: Cannot create `$derived(...)` with `await` outside effect tree. Deriveds run lazily and can be garbage collected, but effects run eagerly and need to be destroyed. Async deriveds use effects internally, so they can only be created inside other effects.

**bind_invalid_checkbox_value**: Use `bind:checked` instead of `bind:value` for checkbox inputs.

**bind_invalid_export**: Cannot use `bind:key` on exported properties. Use `bind:this` to get component instance, then access property directly: `component.key`.

**bind_not_bindable**: Cannot bind to non-bindable properties. Mark properties as bindable with: `let { key = $bindable() } = $props()`.

**component_api_changed**: Calling methods on component instances is invalid in Svelte 5. See migration guide.

**component_api_invalid_new**: Cannot instantiate components with `new`. Set `compatibility.componentApi` to `4` for legacy support.

**derived_references_self**: Derived values cannot reference themselves recursively.

**each_key_duplicate**: Keyed each blocks have duplicate keys at specified indexes/values.

**effect_in_teardown**: Cannot use runes inside effect cleanup functions.

**effect_in_unowned_derived**: Effects cannot be created inside `$derived` values that weren't themselves created inside an effect.

**effect_orphan**: Runes can only be used inside effects (e.g., during component initialization).

**effect_pending_outside_reaction**: `$effect.pending()` can only be called inside effects or deriveds.

**effect_update_depth_exceeded**: Maximum update depth exceeded, typically when an effect reads and writes the same state. Example causing infinite loop:
```js
let count = $state(0);
$effect(() => { count += 1; }); // reads and writes count
```
Same issue with array mutations:
```js
let array = $state(['hello']);
$effect(() => { array.push('goodbye'); }); // reads and writes array
```
Effects can re-run if they settle (e.g., sorting already-sorted array is fine). Solution: make non-state values normal variables, or use `untrack()` to avoid adding state as dependency.

**experimental_async_fork**: Cannot use `fork(...)` unless `experimental.async` compiler option is `true`.

**flush_sync_in_effect**: Cannot use `flushSync` inside effects. Can call after state changes but not during effect flushing. Only applies with `experimental.async` option.

**fork_discarded**: Cannot commit a fork that was already discarded.

**fork_timing**: Cannot create fork inside effect or when state changes are pending.

**get_abort_signal_outside_reaction**: `getAbortSignal()` can only be called inside effects or deriveds.

**hydration_failed**: Failed to hydrate the application.

**invalid_snippet**: Cannot render snippet if expression is null/undefined. Use optional chaining: `{@render snippet?.()}`.

**lifecycle_legacy_only**: Cannot use lifecycle functions in runes mode.

**props_invalid_value**: Cannot do `bind:key={undefined}` when key has a fallback value.

**props_rest_readonly**: Rest element properties of `$props()` are readonly.

**rune_outside_svelte**: Runes only available inside `.svelte` and `.svelte.js/ts` files.

**set_context_after_init**: `setContext` must be called during component initialization, not in effects or after `await`. Only applies with `experimental.async` option.

**state_descriptors_fixed**: Property descriptors on `$state` objects must contain `value` and be `enumerable`, `configurable`, and `writable`.

**state_prototype_fixed**: Cannot set prototype of `$state` object.

**state_unsafe_mutation**: Cannot update state inside `$derived(...)`, `$inspect(...)`, or template expressions. Example:
```svelte
<script>
  let count = $state(0);
  let even = $state(true);
  let odd = $derived.by(() => {
    even = count % 2 === 0; // ERROR: updating state in derived
    return !even;
  });
</script>
```
Solution: make everything derived:
```js
let count = 0;
let even = $derived(count % 2 === 0);
let odd = $derived(!even);
```
Or use `$effect` if side-effects are unavoidable.

**svelte_boundary_reset_onerror**: `<svelte:boundary>` `reset` function cannot be called synchronously in `onerror` callback. Wait for boundary to settle first:
```svelte
<svelte:boundary onerror={async (error, reset) => {
  fixTheError();
  await tick();
  reset();
}}>
</svelte:boundary>
```

## Server Errors

**await_invalid**: Encountered async work while rendering synchronously. Either await `render(...)` result or wrap `await` in `<svelte:boundary>` with `pending` snippet.

**html_deprecated**: `html` property of server render results deprecated. Use `body` instead.

**lifecycle_function_unavailable**: Certain methods like `mount` unavailable on server. Don't call them eagerly during render.

## Shared Errors

**invalid_default_snippet**: Cannot use `{@render children(...)}` if parent uses `let:` directives. Use named snippets instead. Parent with `let:` directive incompatible with child expecting snippet rendering.

**invalid_snippet_arguments**: Snippet functions passed invalid arguments. Snippets should only be instantiated via `{@render ...}`.

**lifecycle_outside_component**: Lifecycle methods can only be used during component initialization at top level of instance script:
```svelte
<script>
  import { onMount } from 'svelte';
  onMount(() => {}) // correct
  function handleClick() {
    onMount(() => {}) // wrong
  }
</script>
```

**missing_context**: Context not set in parent component. `createContext()` returns `[get, set]` pair; `get` throws if `set` not called in parent.

**snippet_without_render_tag**: Attempted to render snippet without `{@render}` block. Change `{snippet}` to `{@render snippet()}`. Examples:
```svelte
<!-- Wrong -->
<script>
  let { children } = $props();
</script>
{children}

<!-- Correct -->
{@render children()}
```

**store_invalid_shape**: Value is not a store with `subscribe` method.

**svelte_element_invalid_this_value**: `this` prop on `<svelte:element>` must be a string if defined.