## Issue
When using custom client code with `StreamingTextResponse` in AI SDK version 3.0.20+, the UI streams raw protocol data like `0: "Je"`, `0: " suis"` instead of plain text.

## Root Cause
AI SDK 3.0.20 switched to a stream data protocol that sends different stream parts to support data, tool calls, etc. The raw protocol response is being displayed instead of parsed text.

## Solutions

**Option 1: Use streamText with toTextStreamResponse()**
```tsx
export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const result = streamText({
    model: openai.completion('gpt-3.5-turbo-instruct'),
    maxOutputTokens: 2000,
    prompt,
  });
  
  return result.toTextStreamResponse();
}
```
This sends a raw text stream instead of the protocol-encoded stream.

**Option 2: Pin to version 3.0.19**
Downgrade to the previous version to keep the raw text stream behavior.