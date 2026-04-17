## Problem

When using `onToolCall` callback with TypeScript and both static and dynamic tools, passing `toolCall.toolName` directly to `addToolOutput` causes a type error because TypeScript cannot narrow the type from generic `string` to the specific literal types of your static tools.

```tsx
const { messages, sendMessage, addToolOutput } = useChat({
  async onToolCall({ toolCall }) {
    addToolOutput({
      tool: toolCall.toolName, // Error: Type 'string' is not assignable to '"getWeatherInformation" | "yourOtherTool"'
      toolCallId: toolCall.toolCallId,
      output: someOutput,
    });
  },
});
```

## Solution

Check `toolCall.dynamic` first to enable type narrowing:

```tsx
const { messages, sendMessage, addToolOutput } = useChat({
  async onToolCall({ toolCall }) {
    if (toolCall.dynamic) {
      return;
    }
    // Now TypeScript knows this is a static tool
    addToolOutput({
      tool: toolCall.toolName, // No error
      toolCallId: toolCall.toolCallId,
      output: someOutput,
    });
  },
});
```

The same approach applies to the deprecated `addToolResult` method.