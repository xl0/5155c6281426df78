## AI SDK RSC

Experimental package for building AI applications with React Server Components (RSC). RSCs render UI on the server and stream to client; combined with Server Actions, they enable LLMs to generate and stream UI directly from server to client.

### Core Functions

**Generative UI Abstractions:**
- `streamUI`: calls a model and allows it to respond with React Server Components
- `useUIState`: returns current UI state and update function (like React's `useState`). UI State is the visual representation of AI state
- `useAIState`: returns current AI state and update function (like React's `useState`). AI state contains context shared with the model (system messages, function responses, etc.)
- `useActions`: provides access to Server Actions from the client for user interactions
- `createAI`: creates a client-server context provider to wrap application tree and manage UI and AI states

**Streamable Values:**
- `createStreamableValue`: creates a stream sending serializable values from server to client
- `readStreamableValue`: reads a streamable value from client created with `createStreamableValue`
- `createStreamableUI`: creates a stream sending UI from server to client
- `useStreamableValue`: accepts streamable value and returns current value, error, and pending state

### Compatibility

The `@ai-sdk/rsc` package is compatible with frameworks that support React Server Components.