## useCompletion Hook

Creates text completion capabilities with streaming support, state management, and automatic UI updates.

### Imports
- React: `import { useCompletion } from '@ai-sdk/react'`
- Svelte: `import { Completion } from '@ai-sdk/svelte'`
- Vue: `import { useCompletion } from '@ai-sdk/vue'`

### Parameters

**Endpoint & Identification:**
- `api` (string, default: '/api/completion'): API endpoint for text generation, can be relative or absolute URL
- `id` (string): Unique identifier for completion; when provided, multiple hook instances with same id share state across components

**Initial State:**
- `initialInput` (string): Optional initial prompt input
- `initialCompletion` (string): Optional initial completion result

**Callbacks:**
- `onFinish` ((prompt: string, completion: string) => void): Called when completion stream ends
- `onError` ((error: Error) => void): Called when stream encounters error

**Request Configuration:**
- `headers` (Record<string, string> | Headers): Optional headers for API endpoint
- `body` (any): Optional additional body object for API endpoint
- `credentials` ('omit' | 'same-origin' | 'include', default: 'same-origin'): Credentials mode for request
- `fetch` (FetchFunction): Optional custom fetch function, defaults to global fetch
- `streamProtocol` ('text' | 'data', default: 'data'): Stream type; 'text' treats stream as text stream

**React-specific:**
- `experimental_throttle` (number): Custom throttle wait time in milliseconds for completion and data updates during streaming; undefined disables throttling

### Returns

**State:**
- `completion` (string): Current text completion
- `input` (string): Current input field value
- `error` (undefined | Error): Error thrown during completion, if any
- `isLoading` (boolean): Whether fetch operation is in progress

**State Setters:**
- `setCompletion` ((completion: string) => void): Update completion state
- `setInput` (React.Dispatch<React.SetStateAction<string>>): Update input state

**Execution:**
- `complete` ((prompt: string, options: { headers, body }) => void): Execute text completion for provided prompt
- `stop` (() => void): Abort current API request

**Event Handlers:**
- `handleInputChange` ((event: any) => void): onChange handler for input field
- `handleSubmit` ((event?: { preventDefault?: () => void }) => void): Form submission handler that resets input and appends user message