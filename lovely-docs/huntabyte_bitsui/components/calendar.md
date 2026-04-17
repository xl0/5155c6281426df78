## Calendar Component

A date picker component that displays dates and days of the week, facilitating date-related interactions. Uses `@internationalized/date` for date handling.

### Basic Structure
```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone } from "@internationalized/date";
  let value = $state(today(getLocalTimeZone()));
</script>

<Calendar.Root type="single" bind:value>
  {#snippet children({ months, weekdays })}
    <Calendar.Header>
      <Calendar.PrevButton />
      <Calendar.Heading />
      <Calendar.NextButton />
    </Calendar.Header>
    {#each months as month}
      <Calendar.Grid>
        <Calendar.GridHead>
          <Calendar.GridRow>
            {#each weekdays as day}
              <Calendar.HeadCell>{day}</Calendar.HeadCell>
            {/each}
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody>
          {#each month.weeks as weekDates}
            <Calendar.GridRow>
              {#each weekDates as date}
                <Calendar.Cell {date} month={month.value}>
                  <Calendar.Day />
                </Calendar.Cell>
              {/each}
            </Calendar.GridRow>
          {/each}
        </Calendar.GridBody>
      </Calendar.Grid>
    {/each}
  {/snippet}
</Calendar.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<Calendar.Root type="single" bind:value={myValue}>
```

**Fully controlled with function bindings:**
```svelte
<script lang="ts">
  let myValue = $state();
  function getValue() { return myValue; }
  function setValue(newValue) { myValue = newValue; }
</script>
<Calendar.Root type="single" bind:value={getValue, setValue}>
```

**Placeholder state** (determines initial month view, updates as user navigates):
```svelte
<script lang="ts">
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>
<Calendar.Root bind:placeholder={myPlaceholder}>
```

### Default Values & Parsing

```svelte
<script lang="ts">
  import { parseDate } from "@internationalized/date";
  const date = "2024-08-03"; // from database
  let value = $state(parseDate(date));
</script>
<Calendar.Root {value}>
```

### Validation

**Minimum/Maximum values:**
```svelte
<script lang="ts">
  import { today, getLocalTimeZone } from "@internationalized/date";
  const todayDate = today(getLocalTimeZone());
</script>
<Calendar.Root minValue={todayDate} value={yesterday}>
<Calendar.Root maxValue={todayDate} value={tomorrow}>
```

**Unavailable dates:**
```svelte
<script lang="ts">
  function isDateUnavailable(date) {
    return date.day === 1;
  }
</script>
<Calendar.Root {isDateUnavailable} value={tomorrow}>
```

**Disabled dates:**
```svelte
<script lang="ts">
  function isDateDisabled(date) {
    return date.day === 1;
  }
</script>
<Calendar.Root {isDateDisabled} value={tomorrow}>
```

**Max days for multiple selection:**
```svelte
<Calendar.Root type="multiple" maxDays={3}>
```

### Appearance & Behavior

**Fixed weeks** (always render 6 weeks):
```svelte
<Calendar.Root fixedWeeks>
```

**Multiple months:**
```svelte
<Calendar.Root numberOfMonths={2}>
```

**Paged navigation** (navigate by number of displayed months instead of 1):
```svelte
<Calendar.Root pagedNavigation>
```

**Localization:**
```svelte
<Calendar.Root locale="fr-FR">
```

**Week starts on** (0=Sunday, 6=Saturday):
```svelte
<Calendar.Root weekStartsOn={1}>
```

**Multiple selection:**
```svelte
<Calendar.Root type="multiple">
```

**Weekday format** ('narrow', 'short', 'long'):
```svelte
<Calendar.Root weekdayFormat="short">
```

### Custom Composition

**Month selector via placeholder:**
```svelte
<script lang="ts">
  import { CalendarDate } from "@internationalized/date";
  let placeholder = $state(new CalendarDate(2024, 8, 3));
</script>
<button onclick={() => { placeholder = placeholder.set({ month: 8 }); }}>
  Set month to August
</button>
<Calendar.Root bind:placeholder>
```

### Examples

**Month and Year Selects:**
```svelte
<Calendar.Root type="single" bind:value>
  {#snippet children({ months, weekdays })}
    <Calendar.Header class="flex items-center justify-between gap-3">
      <Calendar.MonthSelect aria-label="Select month" class="w-full" />
      <Calendar.YearSelect aria-label="Select year" />
    </Calendar.Header>
    <!-- grid rendering -->
  {/snippet}
</Calendar.Root>
```

**Preset Dates:**
```svelte
<script lang="ts">
  const currentDate = today(getLocalTimeZone());
  let value = $state(currentDate);
  const presets = [
    { label: "Today", onclick: () => { value = currentDate; } },
    { label: "Tomorrow", onclick: () => { value = currentDate.add({ days: 1 }); } },
    { label: "In 3 days", onclick: () => { value = currentDate.add({ days: 3 }); } },
    { label: "In a week", onclick: () => { value = currentDate.add({ days: 7 }); } },
    { label: "In a month", onclick: () => { value = currentDate.add({ months: 1 }); } },
    { label: "In a year", onclick: () => { value = currentDate.add({ years: 1 }); } }
  ];
</script>
<Calendar.Root type="single" bind:value>
  <!-- render calendar and preset buttons -->
</Calendar.Root>
```

### API Reference

**Calendar.Root** props:
- `type` (required): 'single' | 'multiple'
- `value` ($bindable): DateValue | DateValue[]
- `onValueChange`: callback when value changes
- `placeholder`: DateValue for initial month view
- `onPlaceholderChange`: callback when placeholder changes
- `pagedNavigation`: boolean (default: false)
- `preventDeselect`: boolean (default: false)
- `weekStartsOn`: 0-6 (default: locale-based)
- `weekdayFormat`: 'narrow' | 'short' | 'long' (default: 'narrow')
- `calendarLabel`: string
- `fixedWeeks`: boolean (default: false)
- `isDateDisabled`: (date: DateValue) => boolean
- `isDateUnavailable`: (date: DateValue) => boolean
- `maxValue`: DateValue
- `minValue`: DateValue
- `locale`: string (default: 'en')
- `numberOfMonths`: number (default: 1)
- `disabled`: boolean (default: false)
- `readonly`: boolean (default: false)
- `initialFocus`: boolean (default: false)
- `disableDaysOutsideMonth`: boolean (default: false)
- `maxDays`: number (for multiple type)
- `monthFormat`: 'short' | 'long' | 'narrow' | 'numeric' | '2-digit' | function (default: 'long')
- `yearFormat`: 'numeric' | '2-digit' | function (default: 'numeric')
- `ref` ($bindable): HTMLDivElement
- `children`: Snippet with { months: Month<DateValue>[], weekdays: string[] }

**Calendar.Root** data attributes:
- `data-invalid`: when calendar is invalid
- `data-disabled`: when calendar is disabled
- `data-readonly`: when calendar is readonly
- `data-calendar-root`: always present

**Other components:**
- `Calendar.Header`, `Calendar.Heading`, `Calendar.NextButton`, `Calendar.PrevButton`
- `Calendar.Grid`, `Calendar.GridHead`, `Calendar.GridBody`, `Calendar.GridRow`
- `Calendar.Cell`, `Calendar.Day`, `Calendar.HeadCell`
- `Calendar.MonthSelect`, `Calendar.YearSelect`

**Calendar.Cell** data attributes:
- `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-outside-visible-months`, `data-focused`, `data-selected`
- `data-value`: date in "YYYY-MM-DD" format
- `data-calendar-cell`: always present

**Calendar.Day** data attributes:
- Same as Calendar.Cell, with `data-calendar-day` instead of `data-calendar-cell`