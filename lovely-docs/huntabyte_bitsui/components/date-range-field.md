## DateRangeField Component

Combines two Date Field components to create a date range input with separate start and end date segments.

### Basic Structure
```svelte
<DateRangeField.Root>
  <DateRangeField.Label>Check-in date</DateRangeField.Label>
  {#each ["start", "end"] as const as type}
    <DateRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangeField.Segment {part}>
            {value}
          </DateRangeField.Segment>
        {/each}
      {/snippet}
    </DateRangeField.Input>
  {/each}
</DateRangeField.Root>
```

### State Management

**Placeholder (two-way binding):**
```svelte
<script>
  import { DateRangeField } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<DateRangeField.Root bind:placeholder={myPlaceholder}>
```

**Placeholder (fully controlled):**
```svelte
<script>
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
  function getPlaceholder() { return myPlaceholder; }
  function setPlaceholder(newPlaceholder) { myPlaceholder = newPlaceholder; }
</script>
<DateRangeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
```

**Value (two-way binding):**
```svelte
<script>
  import { DateRangeField, type DateRange } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state<DateRange>({
    start: new CalendarDateTime(2024, 8, 3, 12, 30),
    end: new CalendarDateTime(2024, 8, 4, 12, 30),
  });
</script>
<button onclick={() => {
  myValue = {
    start: myValue.start.add({ days: 1 }),
    end: myValue.end.add({ days: 1 }),
  };
}}>Add 1 day</button>
<DateRangeField.Root bind:value={myValue}>
```

**Value (fully controlled):**
```svelte
<script>
  let myValue = $state<DateRange>({
    start: undefined,
    end: undefined,
  });
  function getValue() { return myValue; }
  function setValue(newValue) { myValue = newValue; }
</script>
<DateRangeField.Root bind:value={getValue, setValue}>
```

### DateRangeField.Root Props
- `value` $bindable: `DateRange` - { start: DateValue; end: DateValue }
- `onValueChange`: (value: DateRange) => void
- `placeholder` $bindable: DateValue (CalendarDate | CalendarDateTime | ZonedDateTime)
- `onPlaceholderChange`: (date: DateValue) => void
- `errorMessageId`: string - id of error message element
- `validate`: (date: DateValue) => string[] | string | void
- `onInvalid`: (reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void
- `minValue`: DateValue
- `maxValue`: DateValue
- `granularity`: 'day' | 'hour' | 'minute' | 'second' (defaults to 'day' for CalendarDate, 'minute' otherwise)
- `hideTimeZone`: boolean (default: false)
- `hourCycle`: '12' | '24' (defaults to locale preference)
- `locale`: string (default: en-US)
- `disabled`: boolean (default: false)
- `readonly`: boolean (default: false)
- `readonlySegments`: EditableSegmentPart[] - segments that prevent user input
- `required`: boolean (default: false)
- `onStartValueChange`: (value: DateValue) => void
- `onEndValueChange`: (value: DateValue) => void
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: Snippet

Data attribute: `data-date-range-field-root`

### DateRangeField.Input Props
- `type` required: 'start' | 'end'
- `name`: string - for form submission, renders hidden input
- `ref` $bindable: HTMLDivElement
- `children`: Snippet with { segments: Array<{ part: SegmentPart; value: string }> }
- `child`: Snippet

Data attributes: `data-invalid`, `data-disabled`, `data-date-field-input`

### DateRangeField.Segment Props
- `part` required: SegmentPart - "month" | "day" | "year" | "hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal"
- `ref` $bindable: HTMLSpanElement
- `children`: Snippet
- `child`: Snippet

Data attributes: `data-invalid`, `data-disabled`, `data-segment`, `data-date-field-segment`

### DateRangeField.Label Props
- `ref` $bindable: HTMLSpanElement
- `children`: Snippet
- `child`: Snippet

Data attributes: `data-invalid`, `data-date-field-label`

**Note:** Requires understanding of date/time handling in Bits UI (see Dates documentation).