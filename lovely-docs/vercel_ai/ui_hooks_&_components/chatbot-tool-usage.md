## Tool Types and Flow

Three types of tools are supported:
1. Automatically executed server-side tools
2. Automatically executed client-side tools
3. Tools requiring user interaction (confirmation dialogs)

Flow:
1. User sends message to API route
2. Language model generates tool calls via `streamText`
3. Tool calls forwarded to client
4. Server-side tools executed via `execute` method, results forwarded
5. Client-side auto-execute tools handled via `onToolCall` callback with `addToolOutput`
6. Interactive tools displayed in UI, available in message `parts` as tool invocation parts
7. User interaction triggers `addToolOutput` to submit results
8. `sendAutomaticallyWhen` with `lastAssistantMessageIsCompleteWithToolCalls` auto-submits when all results available

Tool calls are integrated as typed tool parts in assistant messages - initially as tool calls, then as tool results after execution.

## Example Implementation

API route with three tools:
```tsx
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    tools: {
      getWeatherInformation: {
        description: 'show the weather in a given city to the user',
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        },
      },
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        inputSchema: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
      getLocation: {
        description: 'Get the user location. Always ask for confirmation before using this tool.',
        inputSchema: z.object({}),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
```

Client-side with `useChat`:
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)],
        });
      }
    },
  });
  const [input, setInput] = useState('');

  return (
    <>
      {messages?.map(message => (
        <div key={message.id}>
          <strong>{message.role}: </strong>
          {message.parts.map(part => {
            switch (part.type) {
              case 'text':
                return part.text;
              case 'tool-askForConfirmation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-streaming':
                    return <div key={callId}>Loading confirmation request...</div>;
                  case 'input-available':
                    return (
                      <div key={callId}>
                        {part.input.message}
                        <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'Yes, confirmed.' })}>Yes</button>
                        <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'No, denied' })}>No</button>
                      </div>
                    );
                  case 'output-available':
                    return <div key={callId}>Location access allowed: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error: {part.errorText}</div>;
                }
                break;
              }
              case 'tool-getLocation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-streaming':
                    return <div key={callId}>Preparing location request...</div>;
                  case 'input-available':
                    return <div key={callId}>Getting location...</div>;
                  case 'output-available':
                    return <div key={callId}>Location: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error getting location: {part.errorText}</div>;
                }
                break;
              }
              case 'tool-getWeatherInformation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-streaming':
                    return <pre key={callId}>{JSON.stringify(part, null, 2)}</pre>;
                  case 'input-available':
                    return <div key={callId}>Getting weather information for {part.input.city}...</div>;
                  case 'output-available':
                    return <div key={callId}>Weather in {part.input.city}: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error getting weather for {part.input.city}: {part.errorText}</div>;
                }
                break;
              }
            }
          })}
        </div>
      ))}
      <form onSubmit={e => { e.preventDefault(); if (input.trim()) { sendMessage({ text: input }); setInput(''); } }}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </>
  );
}
```

## Error Handling

For client-side tool execution errors, use `addToolOutput` with `state: 'output-error'` and `errorText`:
```tsx
async onToolCall({ toolCall }) {
  if (toolCall.dynamic) return;
  if (toolCall.toolName === 'getWeatherInformation') {
    try {
      const weather = await getWeatherInformation(toolCall.input);
      addToolOutput({
        tool: 'getWeatherInformation',
        toolCallId: toolCall.toolCallId,
        output: weather,
      });
    } catch (err) {
      addToolOutput({
        tool: 'getWeatherInformation',
        toolCallId: toolCall.toolCallId,
        state: 'output-error',
        errorText: 'Unable to get the weather information',
      });
    }
  }
}
```

## Dynamic Tools

For tools with unknown types at compile time, use generic `dynamic-tool` type instead of specific `tool-${toolName}`:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'tool-getWeatherInformation':
      return <WeatherDisplay part={part} />;
    case 'dynamic-tool':
      return (
        <div key={index}>
          <h4>Tool: {part.toolName}</h4>
          {part.state === 'input-streaming' && <pre>{JSON.stringify(part.input, null, 2)}</pre>}
          {part.state === 'output-available' && <pre>{JSON.stringify(part.output, null, 2)}</pre>}
          {part.state === 'output-error' && <div>Error: {part.errorText}</div>}
        </div>
      );
  }
});
```

Useful for MCP tools, user-defined runtime functions, and external tool providers.

## Tool Call Streaming

Enabled by default in v5.0. Partial tool calls stream in real-time. Access via `useChat` hook and message `parts`. Use `state` property to render correct UI:
```tsx
case 'tool-askForConfirmation':
case 'tool-getLocation':
case 'tool-getWeatherInformation':
  switch (part.state) {
    case 'input-streaming':
      return <pre>{JSON.stringify(part.input, null, 2)}</pre>;
    case 'input-available':
      return <pre>{JSON.stringify(part.input, null, 2)}</pre>;
    case 'output-available':
      return <pre>{JSON.stringify(part.output, null, 2)}</pre>;
    case 'output-error':
      return <div>Error: {part.errorText}</div>;
  }
```

## Step Start Parts

For multi-step tool calls, use `step-start` parts to display boundaries:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'step-start':
      return index > 0 ? <div key={index} className="text-gray-500"><hr className="my-2 border-gray-300" /></div> : null;
    case 'text':
    case 'tool-askForConfirmation':
    // ...
  }
});
```

## Server-side Multi-Step Calls

Use `streamText` with `stopWhen: stepCountIs(5)` when all tools have `execute` functions:
```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  tools: {
    getWeatherInformation: {
      description: 'show the weather in a given city to the user',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }: { city: string }) => {
        const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
        return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      },
    },
  },
  stopWhen: stepCountIs(5),
});
```

## Error Masking

Language model tool call errors are masked by default for security. Surface them with `onError` in `toUIMessageStreamResponse`:
```tsx
export function errorHandler(error: unknown) {
  if (error == null) return 'unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

const result = streamText({ /* ... */ });
return result.toUIMessageStreamResponse({ onError: errorHandler });
```

Or with `createUIMessageResponse`:
```tsx
const response = createUIMessageResponse({
  async execute(dataStream) { /* ... */ },
  onError: error => `Custom error: ${error.message}`,
});
```

Key notes:
- Always check `if (toolCall.dynamic)` first in `onToolCall` for proper type narrowing
- Call `addToolOutput` without `await` to avoid deadlocks
- Render messages using `parts` property with typed tool part names like `tool-askForConfirmation`
- Tool parts have states: `input-streaming`, `input-available`, `output-available`, `output-error`