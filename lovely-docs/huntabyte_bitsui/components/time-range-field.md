## TimeRangeField Component

Combines two Time Field components to create a time range input field with start and end times.

### Basic Structure
```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
</script>
<TimeRangeField.Root>
  <TimeRangeField.Label>Working Hours</TimeRangeField.Label>
  {#each ["start", "end"] as const as type}
    <TimeRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <TimeRangeField.Segment {part}>
            {value}
          </TimeRangeField.Segment>
        {/each}
      {/snippet}
    </TimeRangeField.Input>
  {/each}
</TimeRangeField.Root>
```

### Managing Placeholder State

Two-way binding:
```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myPlaceholder = $state(new Time(12, 30));
</script>
<TimeRangeField.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</TimeRangeField.Root>
```

Fully controlled with function binding:
```svelte
let myPlaceholder = $state(new Time(12, 30));
function getPlaceholder() { return myPlaceholder; }
function setPlaceholder(newPlaceholder: TimeValue) { myPlaceholder = newPlaceholder; }
<TimeRangeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
```

### Managing Value State

Two-way binding:
```svelte
<script lang="ts">
  import { TimeRangeField, type TimeRange } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myValue = $state<TimeRange>({
    start: new Time(12, 30),
    end: new Time(12, 30),
  });
</script>
<button onclick={() => {
  myValue = {
    start: myValue.start.add({ hours: 1 }),
    end: myValue.end.add({ hours: 1 }),
  };
}}>Add 1 hour</button>
<TimeRangeField.Root bind:value={myValue}>
```

Fully controlled:
```svelte
let myValue = $state<TimeRange | undefined>({
  start: undefined,
  end: undefined,
});
function getValue() { return myValue; }
function setValue(newValue: TimeRange | undefined) { myValue = newValue; }
<TimeRangeField.Root bind:value={getValue, setValue}>
```

### API Reference

**TimeRangeField.Root** - Root component with properties:
- `value` $bindable: `TimeRange` - { start: TimeValue | undefined; end: TimeValue | undefined }
- `onValueChange`: callback when time range changes
- `placeholder` $bindable: `TimeValue` (Time | CalendarDateTime | ZonedDateTime)
- `onPlaceholderChange`: callback when placeholder changes
- `errorMessageId`: id of error message element
- `validate`: function returning validation errors
- `onInvalid`: callback with reason ('min' | 'max' | 'custom') and optional message
- `minValue`, `maxValue`: TimeValue constraints
- `granularity`: 'hour' | 'minute' | 'second' (default: 'minute')
- `hideTimeZone`: boolean (default: false)
- `hourCycle`: '12' | '24'
- `locale`: string (default: 'en-US')
- `disabled`, `readonly`, `required`: boolean flags
- `readonlySegments`: EditableTimeSegmentPart[] - segments that prevent user input
- `onStartValueChange`, `onEndValueChange`: callbacks for individual time changes
- `ref` $bindable: HTMLDivElement
- `children`, `child`: Snippet for content
- Data attribute: `data-time-range-field-root`

**TimeRangeField.Input** - Container for segments:
- `type` required: 'start' | 'end'
- `name`: string for form submission (renders hidden input)
- `ref` $bindable: HTMLDivElement
- `children`: Snippet with segments array { part: TimeSegmentPart; value: string }[]
- `child`: Snippet for render delegation
- Data attributes: `data-invalid`, `data-disabled`, `data-time-field-input`

**TimeRangeField.Segment** - Individual time segment:
- `part` required: "hour" | "minute" | "second" | "dayPeriod" | "timeZoneName" | "literal"
- `ref` $bindable: HTMLSpanElement
- `children`, `child`: Snippet for content
- Data attributes: `data-invalid`, `data-disabled`, `data-segment`, `data-time-field-segment`

**TimeRangeField.Label** - Label component:
- `ref` $bindable: HTMLSpanElement
- `children`, `child`: Snippet for content
- Data attributes: `data-invalid`, `data-time-field-label`