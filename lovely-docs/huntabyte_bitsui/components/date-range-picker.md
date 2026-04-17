## DateRangePicker Component

A composite component for selecting date ranges using an input field and calendar interface. Combines DateRangeField, RangeCalendar, and Popover components.

### Basic Structure
```svelte
<DateRangePicker.Root>
  <DateRangePicker.Label />
  {#each ["start", "end"] as type}
    <DateRangePicker.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <DateRangePicker.Segment {part}>{value}</DateRangePicker.Segment>
        {/each}
      {/snippet}
    </DateRangePicker.Input>
  {/each}
  <DateRangePicker.Trigger />
  <DateRangePicker.Content>
    <DateRangePicker.Calendar>
      {#snippet children({ months, weekdays })}
        <DateRangePicker.Header>
          <DateRangePicker.PrevButton />
          <DateRangePicker.Heading />
          <DateRangePicker.NextButton />
        </DateRangePicker.Header>
        {#each months as month}
          <DateRangePicker.Grid>
            <DateRangePicker.GridHead>
              <DateRangePicker.GridRow>
                {#each weekdays as day}
                  <DateRangePicker.HeadCell>{day}</DateRangePicker.HeadCell>
                {/each}
              </DateRangePicker.GridRow>
            </DateRangePicker.GridHead>
            <DateRangePicker.GridBody>
              {#each month.weeks as weekDates}
                <DateRangePicker.GridRow>
                  {#each weekDates as date}
                    <DateRangePicker.Cell {date} month={month.value}>
                      <DateRangePicker.Day>{date.day}</DateRangePicker.Day>
                    </DateRangePicker.Cell>
                  {/each}
                </DateRangePicker.GridRow>
              {/each}
            </DateRangePicker.GridBody>
          </DateRangePicker.Grid>
        {/each}
      {/snippet}
    </DateRangePicker.Calendar>
  </DateRangePicker.Content>
</DateRangePicker.Root>
```

### State Management

**Placeholder** (determines segment starting point when no value exists):
```svelte
<script>
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<DateRangePicker.Root bind:placeholder={myPlaceholder}>
```

Or fully controlled:
```svelte
let myPlaceholder = $state();
function getPlaceholder() { return myPlaceholder; }
function setPlaceholder(newPlaceholder) { myPlaceholder = newPlaceholder; }
<DateRangePicker.Root bind:placeholder={getPlaceholder, setPlaceholder}>
```

**Value** (selected date range):
```svelte
let myValue = $state({
  start: new CalendarDateTime(2024, 8, 3, 12, 30),
  end: new CalendarDateTime(2024, 8, 4, 12, 30),
});
<DateRangePicker.Root bind:value={myValue}>
```

Or fully controlled:
```svelte
let myValue = $state();
function getValue() { return myValue; }
function setValue(newValue) { myValue = newValue; }
<DateRangePicker.Root bind:value={getValue, setValue}>
```

**Open state**:
```svelte
let isOpen = $state(false);
<button onclick={() => (isOpen = true)}>Open</button>
<DateRangePicker.Root bind:open={isOpen}>
```

Or fully controlled:
```svelte
let myOpen = $state(false);
function getOpen() { return myOpen; }
function setOpen(newOpen) { myOpen = newOpen; }
<DateRangePicker.Root bind:open={getOpen, setOpen}>
```

### Root Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `value` $bindable | `{ start: DateValue; end: DateValue }` | undefined | Selected date range |
| `onValueChange` | `(value: DateRange) => void` | undefined | Callback when value changes |
| `placeholder` $bindable | `DateValue` | undefined | Placeholder date for segments |
| `onPlaceholderChange` | `(date: DateValue) => void` | undefined | Callback when placeholder changes |
| `readonlySegments` | `EditableSegmentPart[]` | undefined | Segments that prevent user input |
| `isDateUnavailable` | `(date: DateValue) => boolean` | undefined | Function to mark dates unavailable |
| `minValue` | `DateValue` | undefined | Minimum valid date |
| `maxValue` | `DateValue` | undefined | Maximum valid date |
| `validate` | `(date: DateValue) => string[] \| string \| void` | undefined | Custom validation function |
| `onInvalid` | `(reason: 'min' \| 'max' \| 'custom', msg?: string \| string[]) => void` | undefined | Callback when value is invalid |
| `granularity` | `'day' \| 'hour' \| 'minute' \| 'second'` | 'day' for CalendarDate, 'minute' otherwise | Date segment precision |
| `hideTimeZone` | `boolean` | false | Hide timezone segment |
| `errorMessageId` | `string` | undefined | ID of error message element |
| `hourCycle` | `'12' \| '24'` | locale preference | Hour format |
| `locale` | `string` | 'en-US' | Locale for formatting |
| `disabled` | `boolean` | false | Disable field |
| `readonly` | `boolean` | false | Make field readonly |
| `required` | `boolean` | false | Require date selection |
| `closeOnRangeSelect` | `boolean` | true | Close popover after range selected |
| `disableDaysOutsideMonth` | `boolean` | false | Disable days outside current month |
| `pagedNavigation` | `boolean` | false | Navigate by number of displayed months |
| `preventDeselect` | `boolean` | false | Prevent deselecting without selecting another |
| `weekdayFormat` | `'narrow' \| 'short' \| 'long'` | 'narrow' | Weekday label format |
| `weekStartsOn` | `number` | locale default | Day to start week (0=Sunday) |
| `calendarLabel` | `string` | undefined | Accessible calendar label |
| `fixedWeeks` | `boolean` | false | Always display 6 weeks |
| `isDateDisabled` | `(date: DateValue) => boolean` | undefined | Function to disable specific dates |
| `numberOfMonths` | `number` | 1 | Months to display simultaneously |
| `open` $bindable | `boolean` | false | Popover open state |
| `onOpenChange` | `(open: boolean) => void` | undefined | Callback when open state changes |
| `onOpenChangeComplete` | `(open: boolean) => void` | undefined | Callback after animations complete |
| `onEndValueChange` | `(value: DateValue) => void` | undefined | Callback when end date changes |
| `onStartValueChange` | `(value: DateValue) => void` | undefined | Callback when start date changes |
| `minDays` | `number` | undefined | Minimum days in range |
| `maxDays` | `number` | undefined | Maximum days in range |
| `excludeDisabled` | `boolean` | false | Reset range if any date becomes disabled |
| `monthFormat` | `'short' \| 'long' \| 'narrow' \| 'numeric' \| '2-digit' \| (month: number) => string` | 'long' | Month label format |
| `yearFormat` | `'numeric' \| '2-digit' \| (year: number) => string` | 'numeric' | Year label format |

### Data Attributes on Root
- `data-invalid` - Present when calendar is invalid
- `data-disabled` - Present when calendar is disabled
- `data-readonly` - Present when calendar is readonly
- `data-calendar-root` - Always present

### Sub-components

**Label**: Renders span with `data-date-field-label`, `data-invalid`

**Input**: Contains date segments. Props: `type` (required, 'start' | 'end'), `name` (for form submission)

**Segment**: Individual date part. Props: `part` (required, 'month' | 'day' | 'year' | 'hour' | 'minute' | 'second' | 'dayPeriod' | 'literal'). Data attributes: `data-segment`, `data-date-field-segment`, `data-invalid`, `data-disabled`

**Trigger**: Button to toggle popover. Data attributes: `data-state` ('open' | 'closed'), `data-popover-trigger`

**Content**: Popover content container. Props include floating UI options (side, sideOffset, align, alignOffset, avoidCollisions, etc.), focus management (trapFocus, onOpenAutoFocus, onCloseAutoFocus), interaction handling (onInteractOutside, onEscapeKeydown, interactOutsideBehavior, escapeKeydownBehavior), and rendering (forceMount, dir). CSS variables: `--bits-popover-content-transform-origin`, `--bits-popover-content-available-width`, `--bits-popover-content-available-height`, `--bits-popover-anchor-width`, `--bits-popover-anchor-height`

**Portal**: Renders content into body or custom element. Props: `to` (target element, default body), `disabled` (disable portal)

**Calendar**: Calendar grid container. Data attributes: `data-invalid`, `data-disabled`, `data-readonly`, `data-calendar-root`

**Header**: Calendar header. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-header`

**PrevButton/NextButton**: Navigation buttons. Data attributes: `data-disabled`, `data-range-calendar-prev-button` / `data-range-calendar-next-button`

**Heading**: Month/year display. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-heading`

**Grid**: Month grid (table). Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-grid`

**GridRow**: Table row. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-grid-row`

**GridHead**: Table head. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-grid-head`

**HeadCell**: Weekday header cell. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-head-cell`

**GridBody**: Table body. Data attributes: `data-disabled`, `data-readonly`, `data-range-calendar-grid-body`

**Cell**: Date cell. Props: `date` (required), `month` (required). Data attributes: `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-outside-visible-months`, `data-focused`, `data-selected`, `data-value` (YYYY-MM-DD), `data-range-calendar-cell`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`

**Day**: Day element inside cell. Data attributes: same as Cell plus `data-range-calendar-day`

**MonthSelect**: Select for month navigation. Props: `months` (number[], default 1-12), `monthFormat`. Snippet props: `monthItems`, `selectedMonthItem`. Data attributes: `data-disabled`, `data-range-calendar-month-select`

**YearSelect**: Select for year navigation. Props: `years` (number[], default current±100), `yearFormat`. Snippet props: `yearItems`, `selectedYearItem`. Data attributes: `data-disabled`, `data-range-calendar-year-select`

### Notes
- Requires understanding of dates/times in Bits UI (see Dates documentation)
- Composed of DateRangeField, RangeCalendar, and Popover components
- All components support `ref` binding and child/children snippets for customization