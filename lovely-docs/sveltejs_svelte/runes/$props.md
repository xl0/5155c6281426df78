The `$props` rune receives component inputs (properties). Basic usage:

```svelte
<script>
  let { adjective } = $props();
</script>
<p>this component is {adjective}</p>
```

**Fallback values**: Destructuring allows default values when props are undefined:
```js
let { adjective = 'happy' } = $props();
```

**Renaming props**: Use destructuring to rename invalid identifiers or keywords:
```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

**Rest props**: Capture remaining props:
```js
let { a, b, c, ...others } = $props();
```

**Updating props**: Props update reactively when parent changes. Child can temporarily reassign but should not mutate unless the prop is bindable. Regular object mutations have no effect. Reactive state proxy mutations work but trigger `ownership_invalid_mutation` warning. Fallback values are not reactive proxies, so mutations don't cause updates.

**Type safety**: Add type annotations for better IDE support and documentation:
```svelte
<script lang="ts">
  interface Props {
    adjective: string;
  }
  let { adjective }: Props = $props();
</script>
```

Or with JSDoc:
```svelte
<script>
  /** @type {{ adjective: string }} */
  let { adjective } = $props();
</script>
```

**`$props.id()`** (v5.20.0+): Generates a unique ID per component instance, consistent during hydration. Useful for linking elements:
```svelte
<script>
  const uid = $props.id();
</script>
<label for="{uid}-firstname">First Name:</label>
<input id="{uid}-firstname" type="text" />
```