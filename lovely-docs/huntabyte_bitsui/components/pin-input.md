## PIN Input

Customizable component for One-Time Password (OTP), Two-Factor Authentication (2FA), or Multi-Factor Authentication (MFA) input fields. Uses an invisible input element for seamless form submission and browser autofill, with customizable visual cells for each character.

### Key Features
- Invisible input technique for form integration and autofill
- Customizable appearance with full control over visual representation
- Keyboard navigation and screen reader accessibility
- Flexible PIN length and input type support (numeric, alphanumeric)

### Architecture
- Root container (relatively positioned)
- Hidden input field managing actual value
- Visual cells as customizable siblings to the invisible input

### Basic Structure
```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
</script>
<PinInput.Root maxlength={6}>
  {#snippet children({ cells })}
    {#each cells as cell}
      <PinInput.Cell {cell} />
    {/each}
  {/snippet}
</PinInput.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "123456")}> Set value to 123456 </button>
<PinInput.Root bind:value={myValue}>
  <!-- -->
</PinInput.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<PinInput.Root bind:value={getValue, setValue}>
  <!-- ... -->
</PinInput.Root>
```

### Paste Transformation
Sanitize/transform pasted text (e.g., remove hyphens):
```svelte
<PinInput.Root pasteTransformer={(text) => text.replace(/-/g, "")}>
  <!-- ... -->
</PinInput.Root>
```

### HTML Forms
```svelte
<script lang="ts">
  let form = $state<HTMLFormElement>(null!);
</script>
<form method="POST" bind:this={form}>
  <PinInput.Root name="mfaCode" onComplete={() => form.submit()}>
    <!-- ... -->
  </PinInput.Root>
</form>
```

### Input Patterns
Restrict characters using built-in patterns:
```svelte
<script lang="ts">
  import { PinInput, REGEXP_ONLY_DIGITS } from "bits-ui";
</script>
<PinInput.Root pattern={REGEXP_ONLY_DIGITS}>
  <!-- ... -->
</PinInput.Root>
```

Available patterns: `REGEXP_ONLY_DIGITS`, `REGEXP_ONLY_CHARS`, `REGEXP_ONLY_DIGITS_AND_CHARS`

### Complete Example
```svelte
<script lang="ts">
  import { PinInput, REGEXP_ONLY_DIGITS, type PinInputRootSnippetProps } from "bits-ui";
  import { toast } from "svelte-sonner";
  import cn from "clsx";
  let value = $state("");
  type CellProps = PinInputRootSnippetProps["cells"][0];
  function onComplete() {
    toast.success(`Completed with value ${value}`);
    value = "";
  }
</script>
<PinInput.Root
  bind:value
  class="group/pininput text-foreground has-disabled:opacity-30 flex items-center"
  maxlength={6}
  {onComplete}
  pattern={REGEXP_ONLY_DIGITS}
>
  {#snippet children({ cells })}
    <div class="flex">
      {#each cells.slice(0, 3) as cell, i (i)}
        {@render Cell(cell)}
      {/each}
    </div>
    <div class="flex w-10 items-center justify-center">
      <div class="bg-border h-1 w-3 rounded-full"></div>
    </div>
    <div class="flex">
      {#each cells.slice(3, 6) as cell, i (i)}
        {@render Cell(cell)}
      {/each}
    </div>
  {/snippet}
</PinInput.Root>
{#snippet Cell(cell: CellProps)}
  <PinInput.Cell
    {cell}
    class={cn(
      "focus-override",
      "relative h-14 w-10 text-[2rem]",
      "flex items-center justify-center",
      "transition-all duration-75",
      "border-foreground/20 border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
      "text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40",
      "outline-0",
      "data-active:outline-1 data-active:outline-white"
    )}
  >
    {#if cell.char !== null}
      <div>{cell.char}</div>
    {/if}
    {#if cell.hasFakeCaret}
      <div class="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="h-8 w-px bg-white"></div>
      </div>
    {/if}
  </PinInput.Cell>
{/snippet}
```

### API Reference

**PinInput.Root**
| Property | Type | Description |
|----------|------|-------------|
| `value` $bindable | `string` | The input value |
| `onValueChange` | `(value: string) => void` | Callback on value change |
| `disabled` | `boolean` | Disable the input (default: false) |
| `textalign` | `'left' \| 'center' \| 'right'` | Text alignment, affects long-press behavior (default: 'left') |
| `maxlength` | `number` | Maximum PIN length (default: 6) |
| `onComplete` | `(...args: any[]) => void` | Callback when input is completely filled |
| `pasteTransformer` | `(text: string) => string` | Transform pasted text |
| `inputId` | `string` | ID for the hidden input element |
| `pushPasswordManagerStrategy` | `'increase-width' \| 'none'` | Strategy for password manager badge positioning |
| `ref` $bindable | `HTMLDivElement` | Reference to root element |
| `children` | `Snippet<{ cells: PinInputCell[] }>` | Render content |

**PinInput.Cell**
| Property | Type | Description |
|----------|------|-------------|
| `cell` | `{ char: string \| null; isActive: boolean; hasFakeCaret: boolean }` | Cell data from parent |
| `ref` $bindable | `HTMLDivElement` | Reference to cell element |
| `children` | `Snippet` | Render content |

**Data Attributes**
- `data-pin-input-root` on root
- `data-pin-input-cell` on cells
- `data-active` when cell is active
- `data-inactive` when cell is inactive