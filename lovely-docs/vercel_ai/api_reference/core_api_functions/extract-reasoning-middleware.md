## extractReasoningMiddleware

Middleware function that extracts XML-tagged reasoning sections from generated text, separating the AI model's reasoning process from its final output.

### Usage

```ts
import { extractReasoningMiddleware } from 'ai';

const middleware = extractReasoningMiddleware({
  tagName: 'reasoning',
  separator: '\n',
});
```

### Parameters

- `tagName` (string, required): The name of the XML tag to extract reasoning from (without angle brackets)
- `separator` (string, optional): The separator to use between reasoning and text sections. Defaults to `"\n"`
- `startWithReasoning` (boolean, optional): Starts with reasoning tokens. Set to true when the response always starts with reasoning and the initial tag is omitted. Defaults to false

### Returns

A middleware object that:
- Processes both streaming and non-streaming responses
- Extracts content between specified XML tags as reasoning
- Removes the XML tags and reasoning from the main text
- Adds a `reasoning` property to the result containing the extracted content
- Maintains proper separation between text sections using the specified separator

Works with the `LanguageModelV3StreamPart` type for streaming responses.