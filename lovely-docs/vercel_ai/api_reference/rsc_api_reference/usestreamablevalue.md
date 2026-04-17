React hook for consuming streamable values created with `createStreamableValue`.

**Purpose**: Unwraps a streamable value and provides access to its current data, error state, and pending status.

**Import**:
```tsx
import { useStreamableValue } from "@ai-sdk/rsc"
```

**Usage**:
```tsx
function MyComponent({ streamableValue }) {
  const [data, error, pending] = useStreamableValue(streamableValue);

  if (pending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {data}</div>;
}
```

**Returns**: Array tuple with three elements:
1. `data` - The current value from the stream
2. `error` - Error object if thrown during streaming, otherwise undefined
3. `pending` - Boolean indicating if the value is still being streamed

**Note**: AI SDK RSC is experimental; AI SDK UI is recommended for production.