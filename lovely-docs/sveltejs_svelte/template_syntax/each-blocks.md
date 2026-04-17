## Each Blocks

Iterate over arrays, array-like objects, or iterables (Map, Set, etc.) using `{#each expression as name}...{/each}`.

**Basic iteration:**
```svelte
{#each items as item}
  <li>{item.name} x {item.qty}</li>
{/each}
```

**With index:**
```svelte
{#each items as item, i}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

**Keyed each blocks** — provide a unique key expression to intelligently update lists (insert, move, delete) rather than just appending/removing. Keys should be strings or numbers for identity persistence:
```svelte
{#each items as item (item.id)}
  <li>{item.name} x {item.qty}</li>
{/each}

{#each items as item, i (item.id)}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

**Destructuring and rest patterns:**
```svelte
{#each items as { id, name, qty }, i (id)}
  <li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
  <li><span>{id}</span><MyComponent {...rest} /></li>
{/each}

{#each items as [id, ...rest]}
  <li><span>{id}</span><MyComponent values={rest} /></li>
{/each}
```

**Without item binding** — render n times by omitting `as`:
```svelte
{#each { length: 8 }, rank}
  {#each { length: 8 }, file}
    <div class:black={(rank + file) % 2 === 1}></div>
  {/each}
{/each}
```

**Else clause** — rendered when list is empty:
```svelte
{#each todos as todo}
  <p>{todo.text}</p>
{:else}
  <p>No tasks today!</p>
{/each}
```