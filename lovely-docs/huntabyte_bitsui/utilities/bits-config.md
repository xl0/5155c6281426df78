## BitsConfig

Global context provider for setting default props across all Bits UI components within its scope.

### Key Features
- **Scoped defaults**: Applies only to components within its scope
- **Inheritance**: Child instances inherit parent values and can override them
- **Fallback resolution**: Automatically resolves values through config hierarchy

### Basic Usage
```svelte
<script lang="ts">
  import { BitsConfig, Dialog, DateField } from "bits-ui";
</script>
<BitsConfig defaultPortalTo="#modal-root" defaultLocale="es">
  <Dialog.Root>
    <Dialog.Trigger>Open Dialog</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Content>
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog content here</Dialog.Description>
        <DateField.Root><!-- ... --></DateField.Root>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</BitsConfig>
```

### Inheritance & Overrides
Child configs inherit parent values and can selectively override:
```svelte
<BitsConfig defaultPortalTo="#main-portal" defaultLocale="de">
  <Dialog.Root>
    <Dialog.Portal>
      <Dialog.Content>Main dialog</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <BitsConfig defaultPortalTo="#tooltip-portal">
    <Tooltip.Root>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
    <Dialog.Root>
      <Dialog.Portal>
        <Dialog.Content>
          Nested dialog
          <DateField.Root><!-- inherits "de" locale --></DateField.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </BitsConfig>
</BitsConfig>
```

### Real-world Examples

**Global defaults in root layout:**
```svelte
<script lang="ts">
  import { BitsConfig } from "bits-ui";
  import { locale } from "$lib/states/i18n.svelte.js";
  let { children } = $props();
</script>
<BitsConfig defaultPortalTo="body" defaultLocale={locale.current}>
  {@render children()}
</BitsConfig>
```

**Theme-specific configuration with different portal targets:**
```svelte
<div id="header-portals"></div>
<div id="sidebar-portals"></div>
<div id="main-portals"></div>
<header>
  <BitsConfig defaultPortalTo="#header-portals">
    <MyHeader />
  </BitsConfig>
</header>
<aside>
  <BitsConfig defaultPortalTo="#sidebar-portals">
    <MySidebar />
  </BitsConfig>
</aside>
<main>
  <BitsConfig defaultPortalTo="#main-portals">
    <MyContent />
  </BitsConfig>
</main>
```

**Route-specific locales:**
```svelte
<BitsConfig defaultLocale="en">
  {@render children()}
</BitsConfig>
```

### Component-level Overrides
Individual components override global defaults:
```svelte
<BitsConfig defaultPortalTo="#main-portal">
  <Dialog.Root>
    <Dialog.Portal>
      <Dialog.Content>Uses #main-portal</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <Dialog.Root>
    <Dialog.Portal to="#special-portal">
      <Dialog.Content>Uses #special-portal</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</BitsConfig>
```

### Value Resolution Order
1. Direct component prop
2. Nearest parent BitsConfig
3. Inherited from parent BitsConfig(s)
4. Built-in component default (portals default to `"body"`, locales default to `"en"`)

### API Reference

| Property          | Type                 | Description                                          | Default         |
| ----------------- | -------------------- | ---------------------------------------------------- | --------------- |
| `defaultPortalTo` | Element \| string    | Where to render content when open                    | document.body   |
| `defaultLocale`   | string               | Default locale for the app                           | en              |
| `children`        | Snippet              | Children content to render                           | undefined       |