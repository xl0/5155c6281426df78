## Purpose
Transforms UI messages from the `useChat` hook into `ModelMessage` objects compatible with AI core functions like `streamText`.

## Basic Usage
```ts
import { convertToModelMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

## API Signature

**Parameters:**
- `messages: Message[]` - Array of UI messages from useChat hook
- `options?: { tools?: ToolSet, convertDataPart?: (part: DataUIPart) => TextPart | FilePart | null }` - Optional configuration for tools and custom data part conversion

**Returns:** `ModelMessage[]` - Array of ModelMessage objects

## Multi-modal Tool Responses
Tools can implement `toModelOutput` method to return multi-modal content (images, text, etc.):

```ts
const screenshotTool = tool({
  parameters: z.object({}),
  execute: async () => 'imgbase64',
  toModelOutput: result => [{ type: 'image', data: result }],
});

streamText({
  model: openai('gpt-4'),
  messages: convertToModelMessages(messages, {
    tools: { screenshot: screenshotTool },
  }),
});
```

## Custom Data Part Conversion
Convert custom data parts (URLs, code files, JSON configs) attached to user messages by providing a `convertDataPart` callback:

```ts
type CustomUIMessage = UIMessage<never, {
  url: { url: string; title: string; content: string };
  'code-file': { filename: string; code: string; language: string };
}>;

streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages<CustomUIMessage>(messages, {
    convertDataPart: part => {
      if (part.type === 'data-url') {
        return {
          type: 'text',
          text: `[Reference: ${part.data.title}](${part.data.url})\n\n${part.data.content}`,
        };
      }
      if (part.type === 'data-code-file') {
        return {
          type: 'text',
          text: `\`\`\`${part.data.language}\n// ${part.data.filename}\n${part.data.code}\n\`\`\``,
        };
      }
    },
  }),
});
```

**Key behaviors:**
- Only data parts that return a text or file part are included; others are ignored
- Generic parameter provides type safety for custom data parts
- Enables selective inclusion of specific data part types