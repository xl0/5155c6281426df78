## Reactive Built-in Classes

Svelte provides reactive versions of JavaScript built-ins that trigger effects/derived when their contents change:

**MediaQuery** (5.7.0+): Wraps `matchMedia()` with a `current` property reflecting match state. Use CSS media queries when possible to avoid hydration mismatches.
```js
const large = new MediaQuery('min-width: 800px');
// large.current is true/false
```

**SvelteDate**: Reactive `Date` wrapper. Reading via methods like `getTime()`, `toString()`, or `Intl.DateTimeFormat` triggers reactivity.
```js
const date = new SvelteDate();
$effect(() => {
  const interval = setInterval(() => date.setTime(Date.now()), 1000);
  return () => clearInterval(interval);
});
// <p>The time is {formatter.format(date)}</p>
```

**SvelteMap**: Reactive `Map`. Reading via iteration, `size`, `get()`, or `has()` triggers reactivity. Values are not deeply reactive.
```js
let board = new SvelteMap();
let winner = $derived(result(board));
// <button onclick={() => board.set(i, player)}>{board.get(i)}</button>
```

**SvelteSet**: Reactive `Set`. Reading via iteration, `size`, or `has()` triggers reactivity. Values are not deeply reactive.
```js
let monkeys = new SvelteSet();
function toggle(monkey) {
  monkeys.has(monkey) ? monkeys.delete(monkey) : monkeys.add(monkey);
}
// {#if monkeys.has('🙈')}<p>see no evil</p>{/if}
```

**SvelteURL**: Reactive `URL` wrapper. Reading properties like `href`, `pathname`, `protocol`, `hostname` triggers reactivity. `searchParams` returns a `SvelteURLSearchParams`.
```js
const url = new SvelteURL('https://example.com/path');
// <input bind:value={url.protocol} />
// <input bind:value={url.href} />
```

**SvelteURLSearchParams**: Reactive `URLSearchParams`. Reading via iteration, `get()`, or `getAll()` triggers reactivity.
```js
const params = new SvelteURLSearchParams('message=hello');
// <button onclick={() => params.append(key, value)}>append</button>
// {#each params as [key, value]}<p>{key}: {value}</p>{/each}
```

## createSubscriber

(5.7.0+) Integrates external event-based systems with Svelte reactivity. When called in an effect, `start` receives an `update` function that re-runs the effect. If `start` returns a cleanup function, it's called when the effect destroys. Multiple effects share one `start` call; cleanup only runs when all effects are destroyed.

```js
import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';

export class MediaQuery {
  #query;
  #subscribe;

  constructor(query) {
    this.#query = window.matchMedia(`(${query})`);
    this.#subscribe = createSubscriber((update) => {
      const off = on(this.#query, 'change', update);
      return () => off();
    });
  }

  get current() {
    this.#subscribe();
    return this.#query.matches;
  }
}
```