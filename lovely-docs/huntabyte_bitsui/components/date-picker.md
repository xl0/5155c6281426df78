## DatePicker Component

Enables users to select dates using an input field and calendar interface. Composed of three sub-components: Date Field, Calendar, and Popover.

### Structure
```svelte
<DatePicker.Root>
  <DatePicker.Label />
  <DatePicker.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <DatePicker.Segment {part}>{value}</DatePicker.Segment>
      {/each}
      <DatePicker.Trigger />
    {/snippet}
  </DatePicker.Input>
  <DatePicker.Content>
    <DatePicker.Calendar>
      {#snippet children({ months, weekdays })}
        <DatePicker.Header>
          <DatePicker.PrevButton />
          <DatePicker.Heading />
          <DatePicker.NextButton />
        </DatePicker.Header>
        {#each months as month}
          <DatePicker.Grid>
            <DatePicker.GridHead>
              <DatePicker.GridRow>
                {#each weekdays as day}
                  <DatePicker.HeadCell>{day}</DatePicker.HeadCell>
                {/each}
              </DatePicker.GridRow>
            </DatePicker.GridHead>
            <DatePicker.GridBody>
              {#each month.weeks as weekDates}
                <DatePicker.GridRow>
                  {#each weekDates as date}
                    <DatePicker.Cell {date} month={month.value}>
                      <DatePicker.Day />
                    </DatePicker.Cell>
                  {/each}
                </DatePicker.GridRow>
              {/each}
            </DatePicker.GridBody>
          </DatePicker.Grid>
        {/each}
      {/snippet}
    </DatePicker.Calendar>
  </DatePicker.Content>
</DatePicker.Root>
```

### State Management

**Placeholder** (controls which month displays when no date selected):
```svelte
<script>
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state();
</script>
<button onclick={() => myPlaceholder = new CalendarDateTime(2024, 8, 3, 12, 30)}>
  Set placeholder
</button>
<DatePicker.Root bind:placeholder={myPlaceholder}>
```

Or fully controlled:
```svelte
let myPlaceholder = $state();
function getPlaceholder() { return myPlaceholder; }
function setPlaceholder(newPlaceholder) { myPlaceholder = newPlaceholder; }
<DatePicker.Root bind:placeholder={getPlaceholder, setPlaceholder}>
```

**Value** (selected date):
```svelte
let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
<button onclick={() => myValue = myValue.add({ days: 1 })}>Add 1 day</button>
<DatePicker.Root bind:value={myValue}>
```

Or fully controlled:
```svelte
let myValue = $state();
function getValue() { return myValue; }
function setValue(newValue) { myValue = newValue; }
<DatePicker.Root bind:value={getValue, setValue}>
```

**Open state**:
```svelte
let isOpen = $state(false);
<button onclick={() => isOpen = true}>Open DatePicker</button>
<DatePicker.Root bind:open={isOpen}>
```

Or fully controlled:
```svelte
let myOpen = $state(false);
function getOpen() { return myOpen; }
function setOpen(newOpen) { myOpen = newOpen; }
<DatePicker.Root bind:open={getOpen, setOpen}>
```

### API Reference

**DatePicker.Root** properties:
- `value`: DateValue (CalendarDate | CalendarDateTime | ZonedDateTime)
- `onValueChange`: (value: DateValue) => void
- `open` $bindable: boolean (default: false)
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void
- `placeholder`: DateValue - determines which month displays when no date selected
- `onPlaceholderChange`: (date: DateValue) => void
- `isDateUnavailable`: (date: DateValue) => boolean
- `isDateDisabled`: (date: DateValue) => boolean
- `validate`: (date: DateValue) => string[] | string | void
- `onInvalid`: (reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void
- `required`: boolean (default: false)
- `errorMessageId`: string - id of error message element
- `readonlySegments`: EditableSegmentPart[] - segments that prevent user input
- `disableDaysOutsideMonth`: boolean (default: false)
- `closeOnDateSelect`: boolean (default: true)
- `pagedNavigation`: boolean (default: false) - navigate by number of displayed months instead of one
- `preventDeselect`: boolean (default: false)
- `weekStartsOn`: number (0=Sunday, 1=Monday, etc.)
- `weekdayFormat`: 'narrow' | 'short' | 'long' (default: 'narrow')
- `calendarLabel`: string
- `fixedWeeks`: boolean (default: false) - always display 6 weeks
- `maxValue`: DateValue
- `minValue`: DateValue
- `locale`: string (default: 'en')
- `numberOfMonths`: number (default: 1)
- `disabled`: boolean (default: false)
- `readonly`: boolean (default: false)
- `hourCycle`: '12' | '24'
- `granularity`: 'day' | 'hour' | 'minute' | 'second' (default: 'day' for CalendarDate, 'minute' otherwise)
- `hideTimeZone`: boolean (default: false)
- `initialFocus`: boolean (default: false) - focus selected day, today, or first day of month
- `monthFormat`: short | long | narrow | numeric | 2-digit | (month: number) => string (default: 'long')
- `yearFormat`: numeric | 2-digit | (year: number) => string (default: 'numeric')

**DatePicker.Label**: renders label for date field
- `ref` $bindable: HTMLSpanElement
- Data attributes: `data-invalid`, `data-disabled`, `data-date-field-label`

**DatePicker.Input**: contains date field segments
- `ref` $bindable: HTMLDivElement
- `name`: string - for form submission
- Data attributes: `data-invalid`, `data-disabled`, `data-date-field-input`

**DatePicker.Segment**: individual date segment (day, month, year, etc.)
- `part` required: SegmentPart ('day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'dayPeriod' | 'timeZoneName' | 'literal')
- `ref` $bindable: HTMLDivElement
- Data attributes: `data-invalid`, `data-disabled`, `data-readonly`, `data-segment`, `data-date-field-segment`

**DatePicker.Trigger**: toggles popover open/close
- `ref` $bindable: HTMLButtonElement
- Data attributes: `data-state` ('open' | 'closed'), `data-popover-trigger`

**DatePicker.Content**: popover content (positioning options from Popover component)
- `side`: 'top' | 'bottom' | 'left' | 'right' (default: 'bottom')
- `sideOffset`: number (default: 0)
- `align`: 'start' | 'center' | 'end' (default: 'start')
- `alignOffset`: number (default: 0)
- `avoidCollisions`: boolean (default: true)
- `collisionBoundary`: Element | null
- `collisionPadding`: number | Partial<Record<Side, number>> (default: 0)
- `sticky`: 'partial' | 'always' (default: 'partial')
- `hideWhenDetached`: boolean (default: true)
- `updatePositionStrategy`: 'optimized' | 'always' (default: 'optimized')
- `strategy`: 'fixed' | 'absolute' (default: 'fixed')
- `preventScroll`: boolean (default: false)
- `customAnchor`: string | HTMLElement | Measurable | null
- `onInteractOutside`: (event: PointerEvent) => void
- `onFocusOutside`: (event: FocusEvent) => void
- `interactOutsideBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `onEscapeKeydown`: (event: KeyboardEvent) => void
- `escapeKeydownBehavior`: 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore' (default: 'close')
- `onOpenAutoFocus`: (event: Event) => void
- `onCloseAutoFocus`: (event: Event) => void
- `trapFocus`: boolean (default: true)
- `preventOverflowTextSelection`: boolean (default: true)
- `forceMount`: boolean (default: false)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- CSS variables: `--bits-popover-content-transform-origin`, `--bits-popover-content-available-width`, `--bits-popover-content-available-height`, `--bits-popover-anchor-width`, `--bits-popover-anchor-height`

**DatePicker.Portal**: renders content into body or custom element
- `to`: Element | string (default: document.body)
- `disabled`: boolean (default: false)

**DatePicker.Calendar**: calendar grid container
- Data attributes: `data-invalid`, `data-disabled`, `data-readonly`, `data-calendar-root`

**DatePicker.Header**: calendar header
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-header`

**DatePicker.PrevButton**: previous month button
- Data attributes: `data-disabled`, `data-calendar-prev-button`

**DatePicker.Heading**: month/year heading
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-heading`

**DatePicker.NextButton**: next month button
- Data attributes: `data-disabled`, `data-calendar-next-button`

**DatePicker.Grid**: month grid (table)
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-grid`

**DatePicker.GridRow**: row in grid
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-grid-row`

**DatePicker.GridHead**: grid header section
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-grid-head`

**DatePicker.HeadCell**: weekday header cell
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-head-cell`

**DatePicker.GridBody**: grid body section
- Data attributes: `data-disabled`, `data-readonly`, `data-calendar-grid-body`

**DatePicker.Cell**: date cell
- `date` required: DateValue
- `month` required: DateValue
- Data attributes: `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-outside-visible-months`, `data-focused`, `data-selected`, `data-value` (YYYY-MM-DD), `data-calendar-cell`

**DatePicker.Day**: day element in cell
- Data attributes: `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-outside-visible-months`, `data-focused`, `data-selected`, `data-value` (YYYY-MM-DD), `data-calendar-day`

**DatePicker.MonthSelect**: select for month navigation
- `months`: number[] (default: [1-12])
- `monthFormat`: 'narrow' | 'short' | 'long' | 'numeric' | '2-digit' | (month: number) => string (default: 'narrow')
- Data attributes: `data-disabled`, `data-calendar-month-select`

**DatePicker.YearSelect**: select for year navigation
- `years`: number[] (default: current year ±100, constrained by minValue/maxValue if provided)
- `yearFormat`: 'numeric' | '2-digit' | (year: number) => string (default: 'numeric')
- Data attributes: `data-disabled`, `data-calendar-year-select`

Note: Read the Dates documentation to understand how dates/times work in Bits UI. Component can be customized via Date Field, Calendar, and Popover sub-components.