## Navigation Menu

A menu component for navigating between pages of a website. Provides a hierarchical, accessible navigation structure with support for dropdowns, submenus, and animations.

### Components

- **NavigationMenu.Root**: Root container managing menu state. Props: `value` (bindable), `onValueChange`, `dir` ('ltr'|'rtl'), `skipDelayDuration` (300ms), `delayDuration` (200ms), `orientation` ('horizontal'|'vertical')
- **NavigationMenu.List**: Menu list container (renders as `<ul>`)
- **NavigationMenu.Item**: List item with optional trigger and content. Props: `value`, `openOnHover` (default true)
- **NavigationMenu.Trigger**: Button that toggles content visibility. Props: `disabled`
- **NavigationMenu.Content**: Dropdown content shown when trigger is active. Props: `forceMount`, `onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`, `onEscapeKeydown`, `escapeKeydownBehavior`
- **NavigationMenu.Link**: Navigation link element. Props: `active`, `onSelect`
- **NavigationMenu.Viewport**: Optional container for rendering content with smooth transitions between items. Exposes CSS variables `--bits-navigation-menu-viewport-width` and `--bits-navigation-menu-viewport-height`
- **NavigationMenu.Indicator**: Optional visual indicator for active trigger (e.g., arrow or highlight)
- **NavigationMenu.Sub**: Submenu root for nested menus

### Basic Structure

```svelte
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Menu Item</NavigationMenu.Trigger>
      <NavigationMenu.Content>Content here</NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/path">Direct Link</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Indicator />
  </NavigationMenu.List>
  <NavigationMenu.Viewport />
</NavigationMenu.Root>
```

### Key Features

**Orientation**: Use `orientation="vertical"` on Root for vertical menus (default is horizontal)

**Viewport**: Optional component that renders Content in a dedicated container. Useful for advanced layouts and animations. Content is rendered in place if Viewport is absent.

**Indicator**: Optional visual element highlighting the active trigger. Useful with Viewport for animated arrows/highlights.

**Submenus**: Nest menus using `NavigationMenu.Sub` instead of Root inside Content:
```svelte
<NavigationMenu.Content>
  <NavigationMenu.Sub>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>Submenu Item</NavigationMenu.Trigger>
        <NavigationMenu.Content>Submenu content</NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.Viewport />
  </NavigationMenu.Sub>
</NavigationMenu.Content>
```

**Advanced Animations**: Use `data-motion` attribute ('from-start'|'from-end'|'to-start'|'to-end') on Content and CSS variables on Viewport for smooth directional animations:
```css
.NavigationMenuContent[data-motion="from-start"] {
  animation-name: enter-from-left;
}
.NavigationMenuViewport {
  width: var(--bits-navigation-menu-viewport-width);
  height: var(--bits-navigation-menu-viewport-height);
}
```

**Force Mounting**: Use `forceMount` on Content and Viewport to keep elements in DOM (useful for SEO). Manage visibility with `data-state` attribute ('open'|'closed'):
```svelte
<NavigationMenu.Content forceMount class="data-[state=closed]:hidden">
```

**Open on Hover**: Default behavior opens Content on trigger hover. Disable with `openOnHover={false}` on Item (requires click/escape to close instead).

**Full Example** (with Viewport and Indicator):
```svelte
<script>
  import { NavigationMenu } from "bits-ui";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  
  const items = [
    { title: "Alert Dialog", href: "/docs/alert-dialog", desc: "Modal dialog..." },
    { title: "Tooltip", href: "/docs/tooltip", desc: "Popup on hover..." }
  ];
</script>

<NavigationMenu.Root class="relative z-10 flex w-full justify-center">
  <NavigationMenu.List class="flex items-center justify-center p-1">
    <NavigationMenu.Item value="getting-started">
      <NavigationMenu.Trigger class="inline-flex items-center px-4 py-2 rounded">
        Getting started
        <CaretDown class="ml-1 size-3 group-data-[state=open]:rotate-180" />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content class="absolute left-0 top-0 w-full sm:w-auto">
        <ul class="grid gap-x-2.5 p-3 sm:w-[600px] sm:grid-cols-3">
          <li class="row-span-3">
            <NavigationMenu.Link href="/" class="flex flex-col justify-end p-6 rounded">
              <div class="text-lg font-medium">Bits UI</div>
              <p>Headless components for Svelte</p>
            </NavigationMenu.Link>
          </li>
          <li>
            <NavigationMenu.Link href="/docs" class="block p-3 rounded">
              <div class="font-medium">Introduction</div>
              <p class="text-sm">Headless components for Svelte and SvelteKit</p>
            </NavigationMenu.Link>
          </li>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger class="inline-flex items-center px-4 py-2 rounded">
        Components
        <CaretDown class="ml-1 size-3 group-data-[state=open]:rotate-180" />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content class="absolute left-0 top-0 w-full sm:w-auto">
        <ul class="grid gap-3 p-3 sm:w-[500px] md:grid-cols-2">
          {#each items as item}
            <li>
              <NavigationMenu.Link href={item.href} class="block p-3 rounded">
                <div class="font-medium">{item.title}</div>
                <p class="text-sm">{item.desc}</p>
              </NavigationMenu.Link>
            </li>
          {/each}
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/docs" class="inline-flex px-4 py-2 rounded">
        Documentation
      </NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Indicator class="top-full flex h-2.5 items-end justify-center">
      <div class="size-2.5 rotate-45 rounded-tl" />
    </NavigationMenu.Indicator>
  </NavigationMenu.List>
  <div class="absolute left-0 top-full flex w-full justify-center">
    <NavigationMenu.Viewport class="relative mt-2.5 rounded-md border shadow-lg" />
  </div>
</NavigationMenu.Root>
```