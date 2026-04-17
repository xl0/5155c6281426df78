## in: and out: Directives

The `in:` and `out:` directives are similar to `transition:` but create unidirectional transitions instead of bidirectional ones.

**Key differences from transition:**
- `in` transitions play independently alongside `out` transitions rather than reversing
- If a block is removed while an `in` transition is in progress, both transitions continue playing simultaneously
- If an `out` transition is aborted, all transitions restart from scratch

**Example:**
```svelte
<script>
  import { fade, fly } from 'svelte/transition';
  let visible = $state(false);
</script>

<label>
  <input type="checkbox" bind:checked={visible}>
  visible
</label>

{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```

In this example, when `visible` becomes true, the div flies in from 200px below. When `visible` becomes false, the div fades out. The transitions don't reverse each other—they play independently.