## Toolbar Component

Displays frequently used actions or tools in a compact and easily accessible bar.

### Basic Structure
```svelte
<script lang="ts">
  import { Toolbar } from "bits-ui";
</script>
<Toolbar.Root>
  <Toolbar.Group>
    <Toolbar.GroupItem />
  </Toolbar.Group>
  <Toolbar.Link />
  <Toolbar.Button />
</Toolbar.Root>
```

### Complete Example
```svelte
<script lang="ts">
  import { Separator, Toolbar } from "bits-ui";
  import Sparkle from "phosphor-svelte/lib/Sparkle";
  import TextAlignCenter from "phosphor-svelte/lib/TextAlignCenter";
  import TextAlignLeft from "phosphor-svelte/lib/TextAlignLeft";
  import TextAlignRight from "phosphor-svelte/lib/TextAlignRight";
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextStrikethrough from "phosphor-svelte/lib/TextStrikethrough";
  let text = $state(["bold"]);
  let align = $state("");
</script>
<Toolbar.Root class="rounded-10px border-border bg-background-alt shadow-mini flex h-12 min-w-max items-center justify-center border px-[4px] py-1">
  <Toolbar.Group bind:value={text} type="multiple" class="flex items-center gap-x-0.5">
    <Toolbar.GroupItem aria-label="toggle bold" value="bold" class="...">
      <TextB class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem aria-label="toggle italic" value="italic" class="...">
      <TextItalic class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem aria-label="toggle strikethrough" value="strikethrough" class="...">
      <TextStrikethrough class="size-6" />
    </Toolbar.GroupItem>
  </Toolbar.Group>
  <Separator.Root class="bg-dark-10 -my-1 mx-1 w-[1px] self-stretch" />
  <Toolbar.Group bind:value={align} type="single" class="flex items-center gap-x-0.5">
    <Toolbar.GroupItem aria-label="align left" value="left" class="...">
      <TextAlignLeft class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem aria-label="align center" value="center" class="...">
      <TextAlignCenter class="size-6" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem aria-label="align right" value="right" class="...">
      <TextAlignRight class="size-6" />
    </Toolbar.GroupItem>
  </Toolbar.Group>
  <Separator.Root class="bg-dark-10 -my-1 mx-1 w-[1px] self-stretch" />
  <div class="flex items-center">
    <Toolbar.Button class="...">
      <Sparkle class="mr-2 size-6" />
      <span>Ask AI</span>
    </Toolbar.Button>
  </div>
</Toolbar.Root>
```

### State Management

**Two-Way Binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "item-1")}>Press item 1</button>
<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={myValue}>
    <!-- ... -->
  </Toolbar.Group>
</Toolbar.Root>
```

**Fully Controlled (Function Binding):**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={getValue, setValue}>
    <!-- ... -->
  </Toolbar.Group>
</Toolbar.Root>
```

### API Reference

**Toolbar.Root**
- `loop` (boolean, default: true): Whether toolbar should loop when navigating
- `orientation` ('horizontal' | 'vertical', default: 'horizontal'): Toolbar orientation
- `ref` ($bindable HTMLDivElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attributes: `data-orientation`, `data-toolbar-root`

**Toolbar.Button**
- `disabled` (boolean, default: false): Whether button is disabled
- `ref` ($bindable HTMLButtonElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attribute: `data-toolbar-button`

**Toolbar.Link**
- `ref` ($bindable HTMLAnchorElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attribute: `data-toolbar-link`

**Toolbar.Group**
- `type` (required, 'single' | 'multiple'): Determines value type (string or string array)
- `value` ($bindable string | string[]): Current value
- `onValueChange` (function): Callback when value changes
- `disabled` (boolean, default: false): Whether group is disabled
- `ref` ($bindable HTMLDivElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attribute: `data-toolbar-group`

**Toolbar.GroupItem**
- `value` (required, string): Item value; sets group value in single mode or pushes to array in multiple mode
- `disabled` (boolean, default: false): Whether item is disabled
- `ref` ($bindable HTMLButtonElement): Reference to underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation snippet
- Data attributes: `data-state` ('on' | 'off'), `data-value`, `data-disabled`, `data-toolbar-item`