## Overview

AI SDK RSC (React Server Components) is an experimental feature for building AI applications. The documentation warns that it's not production-ready and recommends using AI SDK UI instead, with a migration guide available.

## Core Functions

**streamUI** - Helper function that streams React Server Components during tool execution, enabling dynamic UI updates from server-side AI operations.

**createAI** - Context provider that wraps your application and manages shared state between client and server, connecting the language model with your UI.

**createStreamableUI** - Creates a UI component that can be rendered on the server and streamed to the client, allowing progressive rendering of complex components.

**createStreamableValue** - Creates a streamable value (non-UI data) that can be rendered on the server and streamed to the client, useful for streaming data alongside UI.

**getAIState** - Server-side function to read the current AI state (read-only access).

**getMutableAIState** - Server-side function to read and update the AI state, allowing modifications to the AI context during execution.

**useAIState** - Client-side hook to access the AI state from the context provider created by createAI.

**useUIState** - Client-side hook to access the UI state from the context provider, managing client-side UI updates.

**useActions** - Client-side hook to call server actions from the client, enabling client-to-server communication for AI operations.