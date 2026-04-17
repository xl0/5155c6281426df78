## Back-pressure and Cancellation with Streams

Back-pressure is the signal from a consumer to a producer that more values aren't needed yet. When wrapping a generator into a `ReadableStream` using an eager `for await (...)` loop in the `start` handler, the stream doesn't respect back-pressure. The generator continuously pushes values as fast as possible, causing the stream's internal buffer to grow unbounded.

**Eager approach (problematic):**
```jsx
async function* integers() {
  let i = 1;
  while (true) {
    console.log(`yielding ${i}`);
    yield i++;
    await sleep(100);
  }
}

function createStream(iterator) {
  return new ReadableStream({
    async start(controller) {
      for await (const v of iterator) {
        controller.enqueue(v);
      }
      controller.close();
    },
  });
}

async function run() {
  const stream = createStream(integers());
  const reader = stream.getReader();
  for (let i = 0; i < 10_000; i++) {
    const { value } = await reader.read();
    console.log(`read ${value}`);
    await sleep(1_000);
  }
}
```

With this approach, the generator yields ~10 values for every 1 value read, because the generator (100ms per yield) runs 10x faster than the reader (1000ms per read). The stream buffer grows unbounded.

**Lazy approach (correct):**
```jsx
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
```

Using the `pull` handler instead of `start`, values are produced only when the consumer requests them. The `pull` handler is called each time the consumer reads from the stream. This ties the producer's lifetime to the consumer's lifetime.

## Cancellation

When a consumer stops reading from a stream (e.g., user navigates away), the eager approach continues yielding values indefinitely, buffering them in memory until the program runs out of memory. The eager `for await (...)` loop has no signal to stop.

With the lazy approach, when the consumer stops reading, `pull` is no longer called, so the generator stops yielding. This naturally frees resources and allows garbage collection.

## Application to AI Responses

When streaming AI responses (e.g., from an API endpoint), if the client disconnects (user navigates away, page reloads), an eager approach would continue fetching data from the AI service and buffering it server-side until memory is exhausted. A lazy approach ensures that when the fetch connection aborts, the stream stops requesting data, the `ReadableStream` can be garbage collected, and the connection to the AI service is freed.