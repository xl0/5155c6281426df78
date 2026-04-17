# UIMessage

`UIMessage` is the source of truth for application state, representing complete message history with metadata, data parts, and contextual information. Unlike `ModelMessage` (state passed to model), `UIMessage` contains full application state for UI rendering and client-side functionality.

## Type Safety

Accepts three generic parameters:
1. **METADATA** - Custom metadata type
2. **DATA_PARTS** - Custom data part types for structured data
3. **TOOLS** - Tool definitions for type-safe interactions

## Creating Custom UIMessage Type

```typescript
import { InferUITools, ToolSet, UIMessage, tool } from 'ai';
import z from 'zod';

const metadataSchema = z.object({
  someMetadata: z.string().datetime(),
});
type MyMetadata = z.infer<typeof metadataSchema>;

const dataPartSchema = z.object({
  someDataPart: z.object({}),
  anotherDataPart: z.object({}),
});
type MyDataPart = z.infer<typeof dataPartSchema>;

const tools = {
  someTool: tool({}),
} satisfies ToolSet;
type MyTools = InferUITools<typeof tools>;

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;
```

## UIMessage Interface

```typescript
interface UIMessage<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
> {
  id: string;
  role: 'system' | 'user' | 'assistant';
  metadata?: METADATA;
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;
}
```

## UIMessagePart Types

**TextUIPart**: Text content with streaming state
```typescript
type TextUIPart = {
  type: 'text';
  text: string;
  state?: 'streaming' | 'done';
};
```

**ReasoningUIPart**: Reasoning text with streaming state and provider metadata
```typescript
type ReasoningUIPart = {
  type: 'reasoning';
  text: string;
  state?: 'streaming' | 'done';
  providerMetadata?: Record<string, any>;
};
```

**ToolUIPart**: Tool invocations with states (input-streaming, input-available, output-available, output-error). Type name based on tool name (e.g., `tool-someTool`)
```typescript
type ToolUIPart<TOOLS extends UITools = UITools> = ValueOf<{
  [NAME in keyof TOOLS & string]: {
    type: `tool-${NAME}`;
    toolCallId: string;
  } & (
    | {
        state: 'input-streaming';
        input: DeepPartial<TOOLS[NAME]['input']> | undefined;
        providerExecuted?: boolean;
      }
    | {
        state: 'input-available';
        input: TOOLS[NAME]['input'];
        providerExecuted?: boolean;
      }
    | {
        state: 'output-available';
        input: TOOLS[NAME]['input'];
        output: TOOLS[NAME]['output'];
        providerExecuted?: boolean;
      }
    | {
        state: 'output-error';
        input: TOOLS[NAME]['input'];
        errorText: string;
        providerExecuted?: boolean;
      }
  );
}>;
```

**SourceUrlUIPart**: Source URL reference
```typescript
type SourceUrlUIPart = {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
  providerMetadata?: Record<string, any>;
};
```

**SourceDocumentUIPart**: Document source reference
```typescript
type SourceDocumentUIPart = {
  type: 'source-document';
  sourceId: string;
  mediaType: string;
  title: string;
  filename?: string;
  providerMetadata?: Record<string, any>;
};
```

**FileUIPart**: File with IANA media type and URL (hosted or Data URL)
```typescript
type FileUIPart = {
  type: 'file';
  mediaType: string;
  filename?: string;
  url: string;
};
```

**DataUIPart**: Custom data types. Type name based on data part name (e.g., `data-someDataPart`)
```typescript
type DataUIPart<DATA_TYPES extends UIDataTypes> = ValueOf<{
  [NAME in keyof DATA_TYPES & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: DATA_TYPES[NAME];
  };
}>;
```

**StepStartUIPart**: Step boundary marker
```typescript
type StepStartUIPart = {
  type: 'step-start';
};
```