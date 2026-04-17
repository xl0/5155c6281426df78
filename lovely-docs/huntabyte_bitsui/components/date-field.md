## DateField Component

A customizable alternative to the native `<input type="date">` element that provides flexible date selection with segment-based input.

### Structure
```svelte
<DateField.Root>
  <DateField.Label>Check-in date</DateField.Label>
  <DateField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DateField.Segment {part}>{value}</DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
```

### Reusable Component Pattern
Create a `MyDateField` wrapper component that encapsulates styling and structure for reuse throughout the application. The component accepts `value`, `placeholder`, `name`, and `labelText` props with bindable state management.

### Segments
Segments represent individual parts of a date (day, month, year, hour, minute, second) plus "literal" separators. Styling can differ between literal and editable segments.

### Placeholder
The `placeholder` prop determines the starting date when cycling through segments and sets the date granularity. Defaults to the closest allowed date to today as a `CalendarDate`. Use `CalendarDateTime` for time selection or `ZonedDateTime` for timezone support. For birthday fields, set placeholder in a leap year so users born on Feb 29 can select correctly.

**State Management:**
- Two-way binding: `bind:placeholder={myPlaceholder}`
- Fully controlled: `bind:placeholder={getPlaceholder, setPlaceholder}`

### Value State
The selected date value.

**State Management:**
- Two-way binding: `bind:value={myValue}`
- Fully controlled: `bind:value={getValue, setValue}`

### Default Value
Parse ISO 8601 strings using `parseDate()`, `parseDateTime()`, or `parseZonedDateTime()` from `@internationalized/date`:
```svelte
import { parseDate } from "@internationalized/date";
let value = $state(parseDate("2024-08-03"));
<DateField.Root {value}>...</DateField.Root>
```

### Validation

**Minimum Value:**
```svelte
import { today, getLocalTimeZone } from "@internationalized/date";
const todayDate = today(getLocalTimeZone());
<MyDateField minValue={todayDate} value={todayDate.subtract({ days: 1 })} />
```
Marks field invalid if selected date is less than `minValue`.

**Maximum Value:**
```svelte
const todayDate = today(getLocalTimeZone());
<MyDateField maxValue={todayDate} value={todayDate.add({ days: 1 })} />
```
Marks field invalid if selected date is greater than `maxValue`.

**Custom Validation:**
```svelte
function validate(date: DateValue) {
  return date.day === 1 ? "Date cannot be the first day of the month" : undefined;
}
function onInvalid(reason: "min" | "max" | "custom", msg?: string | string[]) {
  if (reason === "custom") {
    console.log(msg); // string or string[]
  } else if (reason === "min") {
    console.log("The date is too early.");
  } else if (reason === "max") {
    console.log("The date is too late.");
  }
}
<MyDateField {validate} {value} {onInvalid} />
```

### Granularity
Controls which segments render. Options: `'day'` (default), `'hour'`, `'minute'`, `'second'`.
```svelte
<MyDateField granularity="second" value={new CalendarDateTime(2024, 8, 2, 12, 30)} />
```

### Localization
```svelte
<MyDateField locale="de" />
```
Affects segment formatting and placeholders.

### API Reference

**DateField.Root Props:**
- `value: DateValue` - Selected date (CalendarDate | CalendarDateTime | ZonedDateTime)
- `onValueChange: (date: DateValue) => void`
- `placeholder: DateValue` (bindable) - Starting date for segments
- `onPlaceholderChange: (date: DateValue) => void`
- `required: boolean` (default: false)
- `validate: (date: DateValue) => string[] | string | void`
- `onInvalid: (reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void`
- `errorMessageId: string` - ID of error message element
- `hourCycle: '12' | '24'` - Hour format preference
- `granularity: 'day' | 'hour' | 'minute' | 'second'` - Segment detail level
- `hideTimeZone: boolean` (default: false)
- `maxValue: DateValue` - Maximum valid date
- `minValue: DateValue` - Minimum valid date
- `locale: string` (default: 'en-US')
- `disabled: boolean` (default: false)
- `readonly: boolean` (default: false)
- `readonlySegments: EditableSegmentPart[]` - Segments to prevent input on
- `children: Snippet`

**DateField.Input Props:**
- `name: string` - Form submission name; renders hidden input if provided
- `ref: HTMLDivElement` (bindable)
- `children: Snippet<{ segments: Array<{ part: SegmentPart; value: string }> }>`
- `child: Snippet` - Render delegation

**Data Attributes on Input:**
- `data-invalid` - Present when field is invalid
- `data-disabled` - Present when field is disabled
- `data-date-field-input`

**DateField.Segment Props:**
- `part: SegmentPart` (required) - 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'dayPeriod' | 'timeZoneName' | 'literal'
- `ref: HTMLDivElement` (bindable)
- `children: Snippet`
- `child: Snippet`

**Data Attributes on Segment:**
- `data-invalid` - Present when field is invalid
- `data-disabled` - Present when field is disabled
- `data-readonly` - Present when field or segment is readonly
- `data-segment` - The segment type being rendered
- `data-date-field-segment`

**DateField.Label Props:**
- `ref: HTMLSpanElement` (bindable)
- `children: Snippet`
- `child: Snippet`

**Data Attributes on Label:**
- `data-invalid` - Present when field is invalid
- `data-disabled` - Present when field is disabled
- `data-date-field-label`