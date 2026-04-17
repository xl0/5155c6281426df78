## readStreamableValue

Reads streamable values created on the server using `createStreamableValue` from the client side.

**Purpose**: Enables client-side consumption of server-streamed values in RSC (React Server Components) applications.

**Import**:
```ts
import { readStreamableValue } from "@ai-sdk/rsc"
```

**Usage**: Returns an async iterator that yields values emitted by the streamable. Iterate with `for await...of` to process each streamed value.

**Example**:
```ts
// Server (app/actions.ts)
async function generate() {
  'use server';
  const streamable = createStreamableValue();
  streamable.update(1);
  streamable.update(2);
  streamable.done(3);
  return streamable.value;
}

// Client (app/page.tsx)
import { readStreamableValue } from '@ai-sdk/rsc';

export default function Page() {
  const [generation, setGeneration] = useState('');
  return (
    <button onClick={async () => {
      const stream = await generate();
      for await (const delta of readStreamableValue(stream)) {
        setGeneration(gen => gen + delta);
      }
    }}>
      Generate
    </button>
  );
}
```

**API**:
- **Parameter**: `stream` (StreamableValue) - the streamable value to read
- **Returns**: AsyncIterator yielding values from the streamable

**Note**: AI SDK RSC is experimental; use AI SDK UI for production.