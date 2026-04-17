# huntabyte/shadcn-svelte

Complete Svelte component library with 60+ composable UI components, CLI-based installation, CSS variable theming, dark mode support, and custom registry system.

  components/: 60+ composable UI components with subcomponents, variants, sizes, and form integration via sveltekit-superforms.
    ./components/accordion.md: Accordion component with single/multiple open items, WAI-ARIA accessible, composed of Root/Item/Trigger/Content subcomponents.
    ./components/alert-dialog.md: Modal dialog component with trigger, header, description, and cancel/action buttons; install via shadcn-svelte CLI.
    ./components/alert.md: Alert component with Root, Title, and Description subcomponents; supports default and destructive variants.
    ./components/aspect-ratio.md: AspectRatio component enforces a specified aspect ratio on content via numeric ratio prop (e.g., 16/9).
    ./components/avatar.md: Avatar component with Image and Fallback subcomponents; displays user images with text fallback when loading fails.
    ./components/badge.md: Badge component with variants (default, secondary, destructive, outline); supports custom styling and badgeVariants helper for link badges.
    ./components/breadcrumb.md: Breadcrumb component for hierarchical navigation; supports custom separators, dropdowns, ellipsis collapse, and responsive desktop/mobile variants.
    ./components/button-group.md: Container for grouping related buttons with consistent styling; supports vertical orientation, separators, nesting, and composition with Input, Select, DropdownMenu, Popover, and InputGroup components.
    ./components/button.md: Button component with variants (primary, secondary, destructive, outline, ghost, link), href support for links, icon support, and loading state via Spinner.
    ./components/calendar.md: Date picker component with single/range selection, dropdown month/year navigation, popover integration, natural language parsing support, and constraint options.
    ./components/card.md: Card component with Root, Header, Title, Description, Action, Content, and Footer sub-components; install with `npx shadcn-svelte@latest add card -y -o`.
    ./components/carousel.md: Embla-based carousel component with sizing, spacing, vertical/horizontal orientation, options, API for state tracking, events, and plugin support (autoplay).
    ./components/chart.md: Chart components built on LayerChart with composition-based design, customizable config, CSS variable theming, and tooltip support.
    ./components/checkbox.md: Checkbox component with checked/disabled states, data-attribute styling, and sveltekit-superforms integration.
    ./components/collapsible.md: Collapsible component with Root, Trigger, and Content subcomponents for expandable/collapsible panels.
    ./components/combobox.md: Searchable dropdown selector built from Popover + Command; supports icons, form integration, and keyboard navigation with refocus pattern.
    ./components/command.md: Composable command menu component with root and dialog variants; supports grouped items, shortcuts, disabled state, and auto-styled icons.
    ./components/context-menu.md: Right-click context menu with items, submenus, checkboxes, radio groups, separators, and keyboard shortcuts.
    ./components/data-table.md: TanStack Table v8 integration with pagination, sorting, filtering, column visibility, row selection, and custom cell rendering via snippets and components.
    ./components/date-picker.md: Popover-based date picker supporting single/range selection, presets, dropdown month navigation, date constraints, and form validation integration.
    ./components/dialog.md: Modal dialog overlay component with Root, Trigger, Content, Header, Title, Description, and Footer subcomponents.
    ./components/drawer.md: Slide-out panel component built on Vaul Svelte with Root, Trigger, Content, Header, Title, Description, Footer, and Close subcomponents; supports responsive Dialog/Drawer switching via MediaQuery.
    ./components/dropdown-menu.md: Menu component with items, groups, checkboxes, radio groups, submenus, shortcuts, and disabled states.
    ./components/empty.md: Empty state component with customizable media (icon/avatar), title, description, and content sections; supports outline/gradient styling and various content types.
    ./components/field.md: Accessible form field wrapper supporting vertical/horizontal/responsive layouts with labels, descriptions, errors, and semantic grouping.
    ./components/form.md: Composable form components with Zod validation, ARIA attributes, and Superforms integration for accessible, type-safe forms with client/server validation.
    ./components/hover-card.md: Hover card component for displaying preview content on hover; Root/Trigger/Content structure; Trigger accepts link attributes.
    ./components/input-group.md: Input group component for adding icons, text, buttons, tooltips, dropdowns, and spinners to inputs/textareas with configurable alignment (inline-end, block-start, block-end); supports custom inputs via data-slot attribute.
    ./components/input-otp.md: Accessible OTP input component with configurable length, pattern validation, separators, error states, and form integration support.
    ./components/input.md: Form input component supporting email, file, disabled, invalid states, labels, helper text, buttons, and sveltekit-superforms validation.
    ./components/item.md: Flex container component for displaying content with title, description, and actions; supports variants (default/outline/muted), sizes (default/sm), media types (icon/image/avatar), grouping with separators, link rendering via child snippet, and dropdown integration.
    ./components/kbd.md: Kbd component displays keyboard input; use Kbd.Root for keys and Kbd.Group to group them; integrates with buttons, tooltips, and input groups.
    ./components/label.md: Accessible label component; use `for` attribute to link to form control id
    ./components/menubar.md: Desktop menubar component with menus, submenus, separators, shortcuts, checkboxes, and radio buttons; install with `npx shadcn-svelte@latest add menubar -y -o`
    ./components/native-select.md: Native HTML select wrapper with grouping, disabled states, validation, and accessibility support; prefer over Select for native behavior and mobile.
    ./components/navigation-menu.md: Navigation menu component with trigger-based dropdowns and direct links; supports custom layouts, icons, and responsive grids.
    ./components/pagination.md: Pagination component with configurable items-per-page, sibling count, previous/next buttons, and ellipsis support; responsive-friendly with snippet-based rendering.
    ./components/popover.md: Portal popover component with Root, Trigger, and Content subcomponents; install with `npx shadcn-svelte@latest add popover -y -o`.
    ./components/progress.md: Progress bar component with reactive value and max props; install via shadcn-svelte CLI
    ./components/radio-group.md: Radio button group component with controlled value binding and form integration support via sveltekit-superforms.
    ./components/range-calendar.md: Date range picker component built on Bits UI, uses @internationalized/date for date handling
    ./components/resizable.md: Resizable panel groups with horizontal/vertical layouts, keyboard support, and nested pane support via PaneForge.
    ./components/scroll-area.md: Custom-styled scrollable container with vertical, horizontal, or bidirectional scrolling via `orientation` prop.
    ./components/select.md: Select dropdown component with single selection, grouping, disabled items, form integration via sveltekit-superforms, and reactive trigger content via $derived.
    ./components/separator.md: Separator component for visual/semantic content division; supports horizontal (default) and vertical orientations via `orientation` prop.
    ./components/sheet.md: Sheet component: dialog-based overlay sliding from screen edges (top/right/bottom/left), customizable size via CSS classes, with Header/Title/Description/Footer/Close subcomponents.
    ./components/sidebar.md: Composable sidebar with Provider/Root/Header/Content/Footer/Trigger; supports left/right, sidebar/floating/inset variants, offcanvas/icon/none collapse modes; useSidebar hook for state; Menu with Button/Action/Sub/Badge/Skeleton; collapsible groups/menus via Collapsible; OKLch CSS variables for theming.
    ./components/skeleton.md: Skeleton component for loading placeholders; styled with Tailwind classes for size, shape, and spacing.
    ./components/slider.md: Range input with single/multiple thumbs, horizontal/vertical orientation, configurable step and max value.
    ./components/sonner.md: Toast notification component with success/error variants, descriptions, and action buttons; dark mode support via system preferences or theme prop.
    ./components/spinner.md: Spinner component for loading states; customize size/color with utility classes or replace icon; integrates with Button, Badge, InputGroup, Empty, Item components.
    ./components/switch.md: Toggle switch component with form integration, disabled/readonly states, and sveltekit-superforms support.
    ./components/table.md: Responsive table component with Root, Header, Body, Footer, Row, Head, and Cell subcomponents; supports dynamic data rendering, colspan, and Tailwind styling.
    ./components/tabs.md: Tabbed interface component with Root, List, Trigger, and Content subcomponents; activate tabs by matching value props.
    ./components/textarea.md: Textarea component for multi-line text input with support for disabled state, labels, and form validation integration.
    ./components/toggle-group.md: Toggle group component with single/multiple selection modes, outline variant, sm/lg sizes, and disabled state.
    ./components/toggle.md: Two-state toggle button with outline/default variants, sm/default/lg sizes, disabled state, and icon/text content support.
    ./components/tooltip.md: Tooltip component for hover/focus popups; install with `add tooltip -y -o`, wrap app in `Tooltip.Provider`, use `Root`/`Trigger`/`Content`; supports nested providers with custom `delayDuration`.
    ./components/typography.md: Utility-based typography styles for headings (h1-h4), paragraphs (standard, lead, large, small, muted), blockquotes, lists, tables, and inline code using Tailwind classes.
  dark_mode/: Dark mode setup using mode-watcher with toggle components and theme control functions
    ./dark_mode/astro.md: Astro dark mode via Tailwind's class strategy: inline script for FUOC prevention + localStorage sync, mode-watcher for toggling, custom toggle components with setMode/toggleMode/resetMode.
    ./dark_mode/dark-mode.md: Install mode-watcher, add ModeWatcher component to root layout, use toggleMode()/setMode()/resetMode() for theme control.
  installation/: Step-by-step installation and configuration for different project types (SvelteKit, Vite, manual, Astro)
    ./installation/astro-setup.md: Step-by-step Astro project setup: create project, add Svelte/TailwindCSS, configure tsconfig path aliases, init shadcn-svelte with Slate theme and $lib aliases, add components with -y -o flags, use in .astro files with client directives.
    ./installation/manual-setup.md: Manual setup: Tailwind + dependencies + path aliases + CSS variables (light/dark theme) + utils helper + layout import + component installation
    ./installation/sveltekit-setup.md: SvelteKit setup: create project with sv CLI + tailwindcss, run shadcn-svelte init, configure path aliases in svelte.config.js if needed, add components with `npx shadcn-svelte@latest add <component> -y -o`, import from $lib/components/ui/
    ./installation/vite_setup.md: Install TailwindCSS, configure TypeScript/Vite path aliases for $lib, run shadcn-svelte init with $lib-based import paths, add components with -y -o flags, import from $lib/components/ui
  migration_guides/: Step-by-step upgrade paths from Svelte 4→5 and Tailwind v3→v4 with configuration changes, dependency updates, and component migration commands.
    ./migration_guides/svelte-5-migration.md: Migrate to Svelte 5: update components.json aliases/registry, add tailwindcss-animate with sidebar/animation config, simplify utils.ts, update bits-ui/svelte-sonner/@lucide/svelte/paneforge/vaul-svelte/mode-watcher, replace cmdk-sv/svelte-headless-table/lucide-svelte, run `npx shadcn-svelte@latest add <component> -y -o` per component.
    ./migration_guides/tailwind_v4_migration.md: Upgrade shadcn-svelte from Tailwind v3→v4 and Svelte 4→v5: replace PostCSS with Vite, migrate to CSS-based config with `@theme inline`, update `app.css` with HSL variables, replace `tailwindcss-animate` with `tw-animate-css`, update dependencies, optionally update components and colors via CLI.
  registry_schema_&_setup/: JSON schema specification and setup guide for creating custom component registries with styles, themes, blocks, and CSS customizations.
    ./registry_schema_&_setup/registry-examples.md: Registry item JSON schema for styles, themes, blocks with dependencies, CSS variables, base/component/utility styles, and animations.
    ./registry_schema_&_setup/registry-faq.md: Registry item structure with multiple file types, CSS variable configuration for Tailwind colors and theme overrides
    ./registry_schema_&_setup/getting-started.md: Set up a component registry: create registry.json with items, place components in registry/[NAME]/ structure, build with CLI to generate static JSON files, serve and deploy publicly, optionally add token-based auth.
    ./registry_schema_&_setup/registry-item.json_schema.md: JSON schema specification for registry items with properties for name, type, files, dependencies, CSS variables, and metadata.
    ./registry_schema_&_setup/registry.json.md: registry.json schema defines custom component registries with name, homepage, items, path aliases, and dependency overrides.
  ./about.md: Svelte port of shadcn/ui built on Bits UI, Formsnap, Paneforge, Vaul Svelte, Radix UI; MIT licensed
  ./changelog.md: Release history: June 2025 Calendar overhaul; May 2025 Tailwind v4, Charts, custom registries; Feb 2024 Resizable, deep icon imports, Formsnap rewrite ($ids store, Form.Control); Jan 2024 Carousel, Drawer, Sonner, Pagination; Dec 2023 Calendar/RangeCalendar/DatePicker; Nov 2023 ToggleGroup; Oct 2023 Command/Combobox.
  ./cli.md: CLI commands for project initialization (init), component installation (add), and registry building (registry build) with proxy support.
  ./components.json.md: Configuration file for CLI component generation with Tailwind CSS, path aliases, TypeScript, and registry settings.
  ./components--md.md: Index of 70+ shadcn-svelte UI components across forms, dialogs, layouts, and display categories.
  ./dark-mode.md: Dark mode setup for Svelte and Astro
  ./figma.md.md: 
  ./installation--md.md: Installation guides for multiple frameworks; components split into multiple files with barrel exports; VSCode and JetBrains IDE extensions available.
  ./javascript.md: Disable TypeScript via components.json flag; configure jsconfig.json for import aliases.
  ./legacy.md: Legacy documentation index for older Svelte/Tailwind version combinations
  ./migration.md: Latest shadcn-svelte requires Svelte v5 and Tailwind v4; separate migration guides provided.
  ./registry.md: Create custom component registries with JSON-based items compatible with shadcn-svelte CLI; use provided template as starting point.
  ./theming.md: CSS variable-based theming with background/foreground convention; supports light/dark modes; OKLCH color space; pre-configured color presets (Neutral, Stone, Zinc, Gray, Slate); custom colors via @theme inline directive.
