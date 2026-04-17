## createAI

Creates a client-server context provider for managing UI and AI states in your application tree.

**Status**: Experimental. AI SDK RSC is experimental; use AI SDK UI for production. Migration guide available.

**Import**:
```
import { createAI } from "@ai-sdk/rsc"
```

**Parameters**:
- `actions` (Record<string, Action>): Server-side actions callable from the client
- `initialAIState` (any): Initial AI state for the client
- `initialUIState` (any): Initial UI state for the client
- `onGetUIState` (() => UIState): Called during SSR to compare and update UI state
- `onSetAIState` ((Event) => void): Triggered when update() or done() is called by mutable AI state in actions, allowing safe database persistence
  - Event parameters:
    - `state` (AIState): Resulting AI state after update
    - `done` (boolean): Whether AI state updates are finalized

**Returns**: An `<AI/>` context provider component

**Examples**:
- Managing AI and UI states in Next.js
- Persisting and restoring UI/AI states in Next.js