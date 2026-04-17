## Overview
The `@ai-sdk/langchain` module provides helper functions to convert LangChain output streams into AI SDK data streams and responses. It supports LangChain StringOutputParser streams, AIMessageChunk streams, and StreamEvents v2 streams.

## API Methods

**toDataStream**: Converts LangChain output streams (ReadableStream<LangChainAIMessageChunk> or ReadableStream<string>) to AIStream.

**toDataStreamResponse**: Converts LangChain output streams to a Response object with optional ResponseInit, StreamData, and callbacks.

**mergeIntoDataStream**: Merges LangChain output streams into an existing DataStreamWriter with optional callbacks.

## Examples

Convert LangChain Expression Language stream:
```tsx
import { toUIMessageStream } from '@ai-sdk/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const model = new ChatOpenAI({
    model: 'gpt-3.5-turbo-0125',
    temperature: 0,
  });
  const stream = await model.stream(prompt);
  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
```

Convert StringOutputParser stream:
```tsx
const parser = new StringOutputParser();
const stream = await model.pipe(parser).stream(prompt);
return createUIMessageStreamResponse({
  stream: toUIMessageStream(stream),
});
```