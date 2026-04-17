Hook for reading and updating UI state in RSC applications. Returns an array similar to useState with current UI state as first element and update function as second element. UI state is client-side only and can contain functions, React nodes, and other data, serving as the visual representation of AI state.

**Note:** AI SDK RSC is experimental; AI SDK UI is recommended for production. Migration guide available.

**Import:**
```
import { useUIState } from "@ai-sdk/rsc"
```

**Example:** Managing AI and UI states in Next.js applications (see state-management/ai-ui-states example).