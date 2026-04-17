## Store API Reference

The `svelte/store` module provides reactive state management through subscribable stores.

### Core Functions

**readable(value?, start?)** - Creates a read-only store. The optional `start` callback is invoked when the first subscriber subscribes and can return a cleanup function.

**writable(value?, start?)** - Creates a store with both read and write capabilities. Extends `Readable` with `set(value)` to update and inform subscribers, and `update(updater)` to transform the current value.

**derived(stores, fn, initial_value?)** - Creates a derived store from one or more source stores. The aggregation function `fn` receives current values and can either return a new value synchronously or use `set`/`update` callbacks for async operations. Returns a `Readable` store.

**get(store)** - Synchronously retrieves the current value from any store by subscribing and immediately unsubscribing.

**readonly(store)** - Wraps a store to expose only its readable interface, hiding write capabilities.

**fromStore(store)** - Converts a store to a reactive object with a `current` property. For `Writable` stores, `current` is mutable; for `Readable` stores, it's read-only.

**toStore(get, set?)** - Converts getter/setter functions into a store. With both parameters creates a `Writable`, with only `get` creates a `Readable`.

### Core Types

**Readable<T>** - Interface with `subscribe(run, invalidate?)` method. The `run` callback fires on value changes; `invalidate` is an optional cleanup callback.

**Writable<T>** - Extends `Readable<T>` with `set(value)` and `update(updater)` methods.

**Subscriber<T>** - Type for subscription callbacks: `(value: T) => void`

**Unsubscriber** - Type for unsubscribe functions: `() => void`

**Updater<T>** - Type for update callbacks: `(value: T) => T`

**StartStopNotifier<T>** - Type for store initialization callbacks: `(set, update) => void | (() => void)`. Called when first subscriber subscribes, can return cleanup function.