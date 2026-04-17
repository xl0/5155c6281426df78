## Client-side Error Reference

Comprehensive list of runtime errors that can occur in Svelte applications with explanations and solutions.

### Reactivity Errors

**async_derived_orphan**: Cannot create `$derived(...)` with `await` outside effect tree. Deriveds run lazily and can be garbage collected, but async deriveds need effects to call promises proactively. Solution: create async deriveds inside effects.

**derived_references_self**: A derived cannot reference itself recursively.

**effect_in_unowned_derived**: Effects cannot be created inside `$derived` values that weren't themselves created inside an effect.

**effect_orphan**: `$rune%` can only be used inside effects or during component initialization.

**effect_in_teardown**: `%rune%` cannot be used inside effect cleanup functions.

**effect_pending_outside_reaction**: `$effect.pending()` can only be called inside effects or deriveds.

**effect_update_depth_exceeded**: Maximum update depth exceeded, typically when an effect reads and writes the same state. Example causing infinite loop:
```js
let count = $state(0);
$effect(() => {
	count += 1; // reads and writes count
});
```
Same issue with array mutations:
```js
let array = $state(['hello']);
$effect(() => {
	array.push('goodbye'); // reads and writes array
});
```
Solution: use `untrack()` to read state without adding dependency, or make non-state values (like logs arrays) regular variables instead of `$state()`.

**state_unsafe_mutation**: Updating state inside `$derived(...)`, `$inspect(...)` or template expressions is forbidden. Example:
```svelte
<script>
	let count = $state(0);
	let even = $state(true);
	let odd = $derived.by(() => {
		even = count % 2 === 0; // forbidden
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
Or use `$effect` for side-effects.

### Binding Errors

**bind_invalid_checkbox_value**: Using `bind:value` with checkbox input is not allowed. Use `bind:checked` instead.

**bind_invalid_export**: Component has export that consumer tries to access via `bind:%key%`, which is disallowed. Solution: use `bind:this` to bind component instance, then access property on it.

**bind_not_bindable**: Attempting to bind to non-bindable property. Solution: mark property as bindable with `let { %key% = $bindable() } = $props()`.

**props_invalid_value**: Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value.

**props_rest_readonly**: Rest element properties of `$props()` are readonly.

### Component Errors

**component_api_changed**: Calling `%method%` on component instance is no longer valid in Svelte 5.

**component_api_invalid_new**: Attempted to instantiate component with `new %name%`, no longer valid in Svelte 5. Solution: set `compatibility.componentApi` compiler option to `4` to keep working.

### Loop Errors

**each_key_duplicate**: Keyed each block has duplicate key at indexes or with value `%value%` at indexes.

### Context & Lifecycle Errors

**set_context_after_init**: `setContext` must be called during component initialization, not in subsequent effects or after `await`. (Applies with `experimental.async` option, default in Svelte 6)

**lifecycle_legacy_only**: `%name%(...)` cannot be used in runes mode.

### State Errors

**state_descriptors_fixed**: Property descriptors on `$state` objects must contain `value` and be `enumerable`, `configurable`, and `writable`.

**state_prototype_fixed**: Cannot set prototype of `$state` object.

### Async/Fork Errors

**experimental_async_fork**: Cannot use `fork(...)` unless `experimental.async` compiler option is `true`.

**fork_discarded**: Cannot commit fork that was already discarded.

**fork_timing**: Cannot create fork inside effect or when state changes are pending.

**flush_sync_in_effect**: Cannot use `flushSync` inside effect. Can call after state change but not during effect flushing. (Applies with `experimental.async` option)

### Other Errors

**get_abort_signal_outside_reaction**: `getAbortSignal()` can only be called inside effects or deriveds.

**hydration_failed**: Failed to hydrate the application.

**invalid_snippet**: Could not `{@render}` snippet because expression is `null` or `undefined`. Solution: use optional chaining `{@render snippet?.()}`.

**rune_outside_svelte**: `%rune%` rune only available inside `.svelte` and `.svelte.js/ts` files.

**svelte_boundary_reset_onerror**: `<svelte:boundary>` `reset` function cannot be called while error is being handled. Solution: wait for boundary to settle before calling `reset()`, e.g. with `await tick()`:
```svelte
<svelte:boundary onerror={async (error, reset) => {
	fixTheError();
	await tick();
	reset();
}>
</svelte:boundary>
```