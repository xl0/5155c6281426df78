## Overview
`ModelMessage` is the fundamental message structure for AI SDK Core functions, used in the `messages` field. Access the Zod schema via `modelMessageSchema` export.

## Message Types

**SystemModelMessage**: System information message
```typescript
type SystemModelMessage = {
  role: 'system';
  content: string;
};
```
Note: Using the "system" property instead is recommended to prevent prompt injection attacks.

**UserModelMessage**: User message with text, images, or files
```typescript
type UserModelMessage = {
  role: 'user';
  content: string | Array<TextPart | ImagePart | FilePart>;
};
```

**AssistantModelMessage**: Assistant response with text and/or tool calls
```typescript
type AssistantModelMessage = {
  role: 'assistant';
  content: string | Array<TextPart | ToolCallPart>;
};
```

**ToolModelMessage**: Tool call results
```typescript
type ToolModelMessage = {
  role: 'tool';
  content: Array<ToolResultPart>;
};
```

## Content Parts

**TextPart**: Plain text content
```typescript
interface TextPart {
  type: 'text';
  text: string;
}
```

**ImagePart**: Image in user message
```typescript
interface ImagePart {
  type: 'image';
  image: DataContent | URL;  // base64, Uint8Array, ArrayBuffer, Buffer, or URL
  mediaType?: string;  // auto-detected if omitted
}
```

**FilePart**: File in user message
```typescript
interface FilePart {
  type: 'file';
  data: DataContent | URL;
  filename?: string;
  mediaType: string;  // required IANA media type
}
```

**ToolCallPart**: Tool invocation (typically AI-generated)
```typescript
interface ToolCallPart {
  type: 'tool-call';
  toolCallId: string;  // matches with tool result
  toolName: string;
  args: unknown;  // JSON-serializable, matches tool's input schema
}
```

**ToolResultPart**: Tool call result
```typescript
interface ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  output: LanguageModelV3ToolResultOutput;
  providerOptions?: ProviderOptions;
}
```

**LanguageModelV3ToolResultOutput**: Tool result output types
- `{ type: 'text'; value: string; providerOptions?: ProviderOptions }`
- `{ type: 'json'; value: JSONValue; providerOptions?: ProviderOptions }`
- `{ type: 'execution-denied'; reason?: string; providerOptions?: ProviderOptions }`
- `{ type: 'error-text'; value: string; providerOptions?: ProviderOptions }`
- `{ type: 'error-json'; value: JSONValue; providerOptions?: ProviderOptions }`
- `{ type: 'content'; value: Array<...> }` - complex content with text, file-data, file-url, file-id, image-data, image-url, image-file-id, or custom types, each with optional providerOptions