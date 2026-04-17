## useChat Hook

Creates a conversational UI for chatbot applications with streaming message support, automatic state management, and UI updates.

**Import:**
```javascript
import { useChat } from '@ai-sdk/react'
// or
import { Chat } from '@ai-sdk/svelte'
import { Chat } from '@ai-sdk/vue'
```

**Parameters:**

- `chat`: Existing Chat instance (optional, overrides other params)
- `transport`: ChatTransport for sending messages (defaults to DefaultChatTransport with `/api/chat`)
  - `api`: API endpoint string (default: '/api/chat')
  - `credentials`: RequestCredentials mode
  - `headers`: HTTP headers
  - `body`: Extra body object
  - `prepareSendMessagesRequest`: Function to customize request before chat API calls, receives options with `id`, `messages`, `requestMetadata`, `body`, `credentials`, `headers`, `api`, `trigger` ('submit-message' | 'regenerate-message'), `messageId`
  - `prepareReconnectToStreamRequest`: Function to customize reconnect request, receives options with `id`, `requestMetadata`, `body`, `credentials`, `headers`, `api`
- `id`: Unique chat identifier (auto-generated if not provided)
- `messages`: Initial UIMessage[] to populate conversation
- `onToolCall`: Callback when tool call received, must call addToolOutput
- `sendAutomaticallyWhen`: Function determining if messages should resubmit after stream finish or tool call
- `onFinish`: Called when assistant response finishes streaming, receives `message` (UIMessage), `messages` (UIMessage[]), `isAbort` (boolean), `isDisconnect` (boolean), `isError` (boolean), `finishReason` ('stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown')
- `onError`: Error callback
- `onData`: Called when data part received
- `experimental_throttle`: Throttle wait in ms for updates (default: undefined/disabled)
- `resume`: Whether to resume ongoing generation stream (default: false)

**Returns:**

- `id`: Chat identifier string
- `messages`: Current UIMessage[] array
  - `id`: Message identifier
  - `role`: 'system' | 'user' | 'assistant'
  - `parts`: UIMessagePart[] for rendering
  - `metadata`: Optional metadata
- `status`: 'submitted' | 'streaming' | 'ready' | 'error'
- `error`: Error object if occurred
- `sendMessage(message: CreateUIMessage | string, options?: ChatRequestOptions)`: Send message, triggers API call
  - Options: `headers`, `body`, `data`
- `regenerate(options?: { messageId?: string })`: Regenerate last or specific assistant message
- `stop()`: Abort current streaming response
- `clearError()`: Clear error state
- `resumeStream()`: Resume interrupted stream (network error recovery)
- `addToolOutput(options: { tool: string; toolCallId: string; output: unknown } | { tool: string; toolCallId: string; state: "output-error"; errorText: string })`: Add tool result, may trigger auto-submission
- `setMessages(messages: UIMessage[] | function)`: Update messages locally without API call (optimistic updates)

**Note:** AI SDK 5.0 uses transport-based architecture and no longer manages input state internally.