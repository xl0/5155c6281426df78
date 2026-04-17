## Overview
Bits UI uses `DateValue` objects from `@internationalized/date` package for consistent date/time handling across locales and timezones.

## Installation
```bash
npm install @internationalized/date
```

## DateValue Types
Three immutable types represent different date scenarios:

| Type | Purpose | Example |
|------|---------|---------|
| `CalendarDate` | Date only | `2024-07-10` |
| `CalendarDateTime` | Date + time | `2024-07-10T12:30:00` |
| `ZonedDateTime` | Date + time + timezone | `2024-07-10T21:00:00-04:00[America/New_York]` |

### Creating DateValues
```ts
import { CalendarDate, parseDate, today, getLocalTimeZone, CalendarDateTime, parseDateTime, ZonedDateTime, parseZonedDateTime, parseAbsolute, parseAbsoluteToLocal } from "@internationalized/date";

// CalendarDate
const date = new CalendarDate(2024, 7, 10);
const parsed = parseDate("2024-07-10");
const losAngelesToday = today("America/Los_Angeles");
const localToday = today(getLocalTimeZone());

// CalendarDateTime
const dateTime = new CalendarDateTime(2024, 7, 10, 12, 30, 0);
const parsedDT = parseDateTime("2024-07-10T12:30:00");

// ZonedDateTime
const zdt = new ZonedDateTime(2022, 2, 3, "America/Los_Angeles", -28800000, 9, 15, 0);
const zdt1 = parseZonedDateTime("2024-07-12T00:45[America/New_York]");
const zdt2 = parseAbsolute("2024-07-12T07:45:00Z", "America/New_York");
const zdt3 = parseAbsoluteToLocal("2024-07-12T07:45:00Z");
```

## DateRange Type
```ts
type DateRange = {
  start: DateValue;
  end: DateValue;
};
```
Used in Date Range Field, Date Range Picker, Range Calendar components.

## Placeholder Prop
Each date/time component has a bindable `placeholder` prop that:
1. Acts as initial date when no value selected
2. Determines date/time type to display if value absent
3. Controls visible date range in calendar views

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
  
  let placeholder: DateValue = $state(today(getLocalTimeZone()));
  let selectedMonth: number = $state(placeholder.month);
</script>

<select onchange={() => { placeholder = placeholder.set({ month: selectedMonth }); }} bind:value={selectedMonth}>
  <option value={1}>January</option>
  <option value={2}>February</option>
</select>

<Calendar.Root bind:placeholder>
  <!-- Calendar components... -->
</Calendar.Root>
```

## Updating DateValues
Since immutable, use methods that return new instances:
```ts
let placeholder = new CalendarDate(2024, 7, 10);

// Using set()
placeholder = placeholder.set({ month: 8 });

// Using add()
placeholder = placeholder.add({ months: 1 });

// Using subtract()
placeholder = placeholder.subtract({ days: 5 });

// Using cycle()
placeholder = placeholder.cycle("month", "forward", [1, 3, 5, 7, 9, 11]);
```

## Formatting and Parsing
```ts
import { DateFormatter } from "@internationalized/date";

const formatter = new DateFormatter("en-US", {
  dateStyle: "full",
  timeStyle: "short",
});
const formattedDate = formatter.format(myDateValue.toDate("America/New_York"));
// Output: "Wednesday, July 10, 2024 at 12:30 PM"
```

## Key Points
- Month indexing is 1-based (January = 1), unlike JavaScript's Date
- Always reassign when modifying: `date = date.add({ days: 1 })`
- Use `ZonedDateTime` for schedule-critical events
- Match `placeholder` type to needs (use `CalendarDateTime` if time selection needed)
- Reuse `DateFormatter` instances for performance