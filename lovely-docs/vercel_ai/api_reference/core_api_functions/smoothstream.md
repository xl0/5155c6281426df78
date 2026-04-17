## Purpose
`smoothStream` is a TransformStream utility for the `streamText` `experimental_transform` option that smooths text streaming by buffering and releasing complete words/lines with configurable delays, creating a more natural reading experience.

## Basic Usage
```ts
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream({
    delayInMs: 20,      // optional, defaults to 10ms, set to null to disable
    chunking: 'line',   // optional, defaults to 'word'
  }),
});
```

## Parameters

**delayInMs** (number | null, optional)
- Delay in milliseconds between outputting each chunk
- Defaults to 10ms
- Set to `null` to disable delays

**chunking** (optional, defaults to 'word')
- `"word"` - stream word by word
- `"line"` - stream line by line
- `RegExp` - custom regex pattern for splitting
- `(buffer: string) => string | undefined | null` - custom callback function

## Chunking Details

### Word chunking limitations
Word-based chunking doesn't work well with languages that don't delimit words with spaces (Chinese, Japanese, Vietnamese, Thai, Javanese). Use custom regex or callback instead.

### Regex examples
```ts
// Split on underscores
smoothStream({ chunking: /_+/ });
// or equivalently
smoothStream({ chunking: /[^_]*_/ });
```

### Language-specific regex
```ts
// Japanese
smoothStream({ chunking: /[\u3040-\u309F\u30A0-\u30FF]|\S+\s+/ });

// Chinese
smoothStream({ chunking: /[\u4E00-\u9FFF]|\S+\s+/ });
```

### Custom callback
```ts
smoothStream({
  chunking: text => {
    const findString = 'some string';
    const index = text.indexOf(findString);
    return index === -1 ? null : text.slice(0, index) + findString;
  },
});
```

## Returns
A TransformStream that:
- Buffers incoming text chunks
- Releases text when chunking pattern is encountered
- Adds configurable delays between chunks
- Passes through non-text chunks (like step-finish events) immediately