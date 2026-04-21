## Pi Agent Migration Plan

1. Replace the Vercel AI SDK `ToolLoopAgent` in `src/lib/state/agent.svelte.ts` with `@mariozechner/pi-agent-core`'s `Agent`.
2. Keep the existing FIFO challenge queue and websocket lifecycle, but let Pi own transcript state instead of maintaining a separate `conversationHistory` array.
3. Rewrite `src/lib/agent/tools.ts` to Pi `AgentTool[]` definitions using `@mariozechner/pi-ai` TypeBox schemas.
4. Move agent logging to Pi lifecycle events and tool hooks so message history, tool calls, and tool results are captured directly from the runtime.
5. Replace the provider-specific AI SDK model factory with Pi model lookup via `getModel(...)` and dynamic API-key resolution via `getApiKey(...)`.
6. Keep the current system prompt and one-time session bootstrap message containing the Neon Code and resume.
7. Prefer sequential tool execution for deterministic NEON runs and simpler logs.
8. Update package dependencies from the Vercel AI SDK packages to `@mariozechner/pi-agent-core` and `@mariozechner/pi-ai`.
9. Run a type check after the refactor and fix any integration issues.
