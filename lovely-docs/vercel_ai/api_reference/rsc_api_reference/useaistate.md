Hook for reading and updating AI state in RSC applications. The AI state is shared globally across all `useAIState` hooks under the same `<AI/>` provider.

**Purpose**: Enables access to shared context and information passed to the AI model, including system messages, function responses, and other relevant data.

**Import**: `import { useAIState } from "@ai-sdk/rsc"`

**Returns**: A single-element array where the first element is the current AI state.

**Note**: AI SDK RSC is experimental; AI SDK UI is recommended for production use.