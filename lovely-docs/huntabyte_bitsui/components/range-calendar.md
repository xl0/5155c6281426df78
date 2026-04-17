## RangeCalendar Component

A calendar component for selecting date ranges with a calendar interface.

### Basic Structure
```svelte
<RangeCalendar.Root bind:value>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header>
      <RangeCalendar.PrevButton />
      <RangeCalendar.Heading />
      <RangeCalendar.NextButton />
    </RangeCalendar.Header>
    {#each months as month}
      <RangeCalendar.Grid>
        <RangeCalendar.GridHead>
          <RangeCalendar.GridRow>
            {#each weekdays as day}
              <RangeCalendar.HeadCell>{day}</RangeCalendar.HeadCell>
            {/each}
          </RangeCalendar.GridRow>
        </RangeCalendar.GridHead>
        <RangeCalendar.GridBody>
          {#each month.weeks as weekDates}
            <RangeCalendar.GridRow>
              {#each weekDates as date}
                <RangeCalendar.Cell {date} month={month.value}>
                  <RangeCalendar.Day />
                </RangeCalendar.Cell>
              {/each}
            </RangeCalendar.GridRow>
          {/each}
        </RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    {/each}
  {/snippet}
</RangeCalendar.Root>
```

### Key Props on RangeCalendar.Root
- `value` (bindable): `{ start: DateValue | undefined; end: DateValue | undefined }`
- `minDays`: minimum days in range
- `maxDays`: maximum days in range
- `excludeDisabled`: auto-reset range if any date becomes disabled
- `isDateDisabled(date)`: function to disable specific dates
- `isDateUnavailable(date)`: function to mark dates unavailable
- `minValue`/`maxValue`: date bounds
- `numberOfMonths`: display multiple months (default 1)
- `fixedWeeks`: always show 6 weeks
- `pagedNavigation`: navigate by number of displayed months
- `preventDeselect`: prevent deselecting without selecting another date
- `weekdayFormat`: 'narrow' | 'short' | 'long'
- `weekStartsOn`: day of week to start on (0=Sunday)
- `disabled`, `readonly`: disable/readonly states
- `locale`: locale for formatting
- `monthFormat`, `yearFormat`: formatting options

### Examples

**Min Days (3 day minimum):**
```svelte
<RangeCalendar.Root minDays={3} bind:value>
  <!-- ... -->
</RangeCalendar.Root>
```

**Max Days (7 day maximum):**
```svelte
<RangeCalendar.Root maxDays={7} bind:value>
  <!-- ... -->
</RangeCalendar.Root>
```

**Min and Max Days (3-10 day range):**
```svelte
<RangeCalendar.Root minDays={3} maxDays={10} bind:value>
  <!-- ... -->
</RangeCalendar.Root>
```

**Exclude Disabled (disable weekends, auto-reset if range includes weekend):**
```svelte
<RangeCalendar.Root 
  excludeDisabled 
  isDateDisabled={(date) => isWeekend(date, "en-US")}
  bind:value
>
  <!-- ... -->
</RangeCalendar.Root>
```

### Data Attributes
- Root: `data-invalid`, `data-disabled`, `data-readonly`, `data-range-calendar-root`
- Cell: `data-selected`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-highlighted`, `data-disabled`, `data-unavailable`, `data-today`, `data-outside-month`, `data-focused`, `data-value`
- Day: same as Cell plus `data-range-calendar-day`

### Callbacks
- `onValueChange(range)`: called when range changes
- `onStartValueChange(value)`: called when start date changes
- `onEndValueChange(value)`: called when end date changes
- `onPlaceholderChange(date)`: called when placeholder changes

### Additional Components
- `RangeCalendar.MonthSelect`: select to navigate to specific month
- `RangeCalendar.YearSelect`: select to navigate to specific year

Note: Read the Dates documentation to understand how dates/times work in Bits UI.