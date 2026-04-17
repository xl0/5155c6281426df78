The `<svelte:options>` element specifies per-component compiler options.

**Options:**
- `runes={true|false}` — forces component into runes mode or legacy mode
- `namespace="html|svg|mathml"` — namespace where component is used (default: "html")
- `customElement={...}` — options for compiling as custom element; if string, used as tag name
- `css="injected"` — injects styles inline; during SSR as `<style>` tag in head, during CSR via JavaScript

**Deprecated in Svelte 5 (non-functional in runes mode):**
- `immutable={true|false}` — enables/disables referential equality checks for change detection
- `accessors={true|false}` — adds/removes getters and setters for component props

**Example:**
```svelte
<svelte:options customElement="my-custom-element" />
```