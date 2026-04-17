## TimeField Component

Alternative to native `<input type="time">` with customizable segments for hour, minute, second, dayPeriod, and timeZoneName.

### Basic Structure
```svelte
<TimeField.Root>
  <TimeField.Label>Check-in time</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>{value}</TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

### Reusable Component Pattern
Create a `MyTimeField` wrapper that accepts `value`, `placeholder`, `labelText`, and spreads remaining props to `TimeField.Root`. Bind both `value` and `placeholder` for state management.

### Segments
Each segment represents a time part (hour, minute, second, dayPeriod, timeZoneName) or "literal" (separator). Style literals differently from editable segments.

### Placeholder
The `placeholder` prop sets the starting time when cycling through segments, not the empty-state display. Defaults to `12:00 AM` or `00:00` depending on hour cycle.

```svelte
<MyTimeField placeholder={new Time(12, 30)} />
<MyTimeField placeholder={now("America/New_York")} />
```

### State Management

**Two-way binding:**
```svelte
let myValue = $state(new Time(12, 30));
<TimeField.Root bind:value={myValue} />
```

**Fully controlled:**
```svelte
let myValue = $state<TimeValue>();
<TimeField.Root bind:value={() => myValue, (v) => myValue = v} />
```

Same pattern applies to `placeholder` with `bind:placeholder`.

### Default Value
Parse ISO 8601 strings using `parseDateTime()` or `parseZonedDateTime()`:
```svelte
const date = "2024-08-03T15:15";
let value = $state(parseDateTime(date));
<TimeField.Root {value} />
```

### Validation

**Min/Max values:**
```svelte
<MyTimeField minValue={new Time(9, 0)} value={new Time(8, 0)} />
<MyTimeField maxValue={new Time(17, 0)} value={new Time(18, 0)} />
```

**Custom validation:**
```svelte
function validate(time: TimeValue) {
  return time.hour === 12 ? "Time cannot be 12:00 PM" : undefined;
}
function onInvalid(reason: "min" | "max" | "custom", msg?: string | string[]) {
  if (reason === "custom") toast.error(typeof msg === "string" ? msg : msg.join(", "));
  else if (reason === "min") toast.error("The time is too early.");
  else if (reason === "max") toast.error("The time is too late.");
}
<MyTimeField {validate} {value} {onInvalid} />
```

### Granularity
Controls which segments render. Options: `'hour'`, `'minute'` (default), `'second'`.
```svelte
<MyTimeField granularity="second" value={new Time(12, 30)} />
```

### Localization
```svelte
<MyTimeField locale="de" value={new Time(13, 30, 0)} />
```
Affects segment formatting and placeholders. German locale uses 24-hour format without day period.

### API Reference

**TimeField.Root props:**
- `value` $bindable: `TimeValue` (Time | CalendarDateTime | ZonedDateTime)
- `onValueChange`: callback when value changes
- `placeholder` $bindable: starting time for segment cycling
- `onPlaceholderChange`: callback when placeholder changes
- `required`: boolean, default false
- `validate`: (time: TimeValue) => string[] | string | void
- `onInvalid`: (reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void
- `errorMessageId`: id of error message element
- `hourCycle`: '12' | '24', defaults to locale preference
- `granularity`: 'hour' | 'minute' | 'second', default 'minute'
- `hideTimeZone`: boolean, default false (hides timezone segment for ZonedDateTime)
- `maxValue`, `minValue`: TimeValue constraints
- `locale`: string, default 'en-US'
- `disabled`: boolean, default false
- `readonly`: boolean, default false
- `readonlySegments`: EditableTimeSegmentPart[] to make specific segments readonly
- `children`: Snippet

**TimeField.Input props:**
- `name`: string for form submission (renders hidden input)
- `ref` $bindable: HTMLDivElement
- `children`: Snippet with `{ segments: Array<{ part: TimeSegmentPart; value: string }> }`
- `child`: render delegation snippet
- Data attributes: `data-invalid`, `data-disabled`, `data-time-field-input`

**TimeField.Segment props:**
- `part` required: 'hour' | 'minute' | 'second' | 'dayPeriod' | 'timeZoneName' | 'literal'
- `ref` $bindable: HTMLDivElement
- `children`: Snippet
- `child`: render delegation snippet
- Data attributes: `data-invalid`, `data-disabled`, `data-readonly`, `data-segment`, `data-time-field-segment`

**TimeField.Label props:**
- `ref` $bindable: HTMLSpanElement
- `children`: Snippet
- `child`: render delegation snippet
- Data attributes: `data-invalid`, `data-disabled`, `data-time-field-label`