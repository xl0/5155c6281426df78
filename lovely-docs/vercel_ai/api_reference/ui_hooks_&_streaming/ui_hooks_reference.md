AI SDK UI is a framework-agnostic toolkit for building interactive chat, completion, and assistant applications.

**Core Hooks:**
- `useChat`: Hook for chat interface interactions with language models
- `useCompletion`: Hook for completion interface interactions with language models
- `useObject`: Hook for consuming streamed JSON objects

**Utility Functions:**
- `convertToModelMessages`: Converts useChat messages to ModelMessages for AI functions
- `pruneMessages`: Prunes model messages from a list of model messages
- `createUIMessageStream`: Creates a UI message stream to stream additional data to the client
- `createUIMessageStreamResponse`: Creates a response object to stream UI messages to the client
- `pipeUIMessageStreamToResponse`: Pipes a UI message stream to a Node.js ServerResponse object
- `readUIMessageStream`: Transforms a stream of UIMessageChunk objects into an AsyncIterableStream of UIMessage objects

**Framework Support:**
- React: Full support for useChat, useCompletion, useObject
- Svelte: Full support for useChat (Chat), useCompletion (Completion), useObject (StructuredObject)
- Vue.js: Support for useChat and useCompletion, but not useObject

Contributions are welcome to implement missing features for non-React frameworks.