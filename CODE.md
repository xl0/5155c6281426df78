# Codebase State

## Overview

This repository is a SvelteKit app for the NEON authentication puzzle. The app acts as a websocket console that:

- connects to a NEON websocket endpoint
- reconstructs fragmented incoming challenges
- runs a client-side agent against those challenges
- transmits responses back to NEON
- records a structured shared log for transmission and agent activity

The main UI lives on the root `/` page.

## Route

### `src/routes/+page.svelte`

The root page currently renders:

- `ConnectionPanel.svelte` for connection and agent settings
- `SessionLog.svelte` for the shared structured log stream
- `ReferenceDocsDialog.svelte` for the mission/protocol reference docs

The old sidebar memory panel is not currently rendered.

## Architecture

- `src/routes/+page.svelte` wires together the main console UI.
- `src/lib/state/settings.svelte.ts` defines persisted app and agent configuration and exports `settingsState`.
- `src/lib/state/ui.svelte.ts` defines volatile UI state and exports `uiState`.
- `src/lib/state/logger.svelte.ts` defines the shared structured log state and exports `loggerState`.
- `src/lib/state/transmission.svelte.ts` defines websocket/transport state and exports `transmissionState`.
- `src/lib/state/agent.svelte.ts` defines the client-side agent session state and exports `agentState`.
- `src/lib/state/index.ts` re-exports the instantiated states.
- `src/lib/console-actions.ts` owns websocket lifecycle setup and dispatches inbound messages into transmission and agent state.
- `src/lib/agent/tools.ts` exports the tool dictionary available to the agent.
- `src/lib/ai/model-factory.ts` creates provider-specific AI SDK model instances.
- `src/lib/agent-settings.ts` defines supported AI providers, model lists, and UI labels/placeholders.
- `src/lib/protocol.ts` reconstructs inbound fragmented messages.
- `src/lib/types.ts` defines shared fragment, payload, log, and received-message types.
- `src/lib/components/*.svelte` contains the root-page UI pieces.
- `src/lib/components/ui/` contains generated shadcn-svelte primitives. This subtree is excluded from lint and format enforcement.
- `docs/resume.md` provides the default resume text loaded into persisted settings on first use.
- `docs/misson.md` and `docs/protocol.txt` provide the reference material shown in the docs dialog.

## State Model

### `src/lib/state/*`

The app state is split into five instantiated singletons:

- `settings`
  - persisted browser state for `socketUrl`, `neonCode`, `resumeText`, `provider`, `apiKey`, and `model`
  - provider-aware derived values such as `currentProviderConfig` and available `models`
- `ui`
  - volatile UI state for the reference docs dialog: `docsOpen` and `docsTab`
- `logger`
  - append-only in-memory structured log entries in `entries`
  - `log(type, title, metadata?)` appends timestamped log rows
  - used by both transmission and agent code
- `transmission`
  - volatile transport state only: `connectionState`, current websocket reference, and a registered incoming handler
  - no longer stores received/sent message arrays or event history
  - receives reconstructed inbound messages, logs them through `loggerState`, and forwards them to the registered async handler
  - sends outbound `enter_digits` / `speak_text` payloads and logs them through `loggerState`
- `agent`
  - volatile agent session state: `pendingChallenges`, `isRunning`, `lastError`, and persistent `conversationHistory`
  - owns one `ToolLoopAgent` instance per websocket session
  - keeps explicit `ModelMessage[]` history across incoming NEON messages so each new challenge continues the same conversation

Behavior:

- `consoleActions.connect()` resets logger, transmission, and agent state before opening a new websocket session.
- Incoming websocket `challenge` payloads are reconstructed via `reconstructMessage(...)` and passed into `transmissionState.handleIncomingMessage(...)`.
- `transmissionState` logs inbound messages and forwards them to the registered handler.
- `agentState` enqueues incoming challenges and processes them sequentially.
- The agent uses a persistent `ToolLoopAgent` plus accumulated `conversationHistory` to continue the same conversation across multiple NEON prompts.

## Agent

### `src/lib/state/agent.svelte.ts`

The agent layer uses the AI SDK `ToolLoopAgent`.

Key behavior:

- validates that an API key is present before running
- lazily creates the `ToolLoopAgent` on the first challenge of a session
- seeds the conversation history once with:
  - `Neon Code`
  - `Crew Manifest / Resume`
- appends each reconstructed NEON challenge as a new user message in the same session
- logs agent steps, tool results, plain text output, and errors through `loggerState`
- serializes challenge processing with a simple FIFO queue

### `src/lib/agent/tools.ts`

The exported `neonTools` dictionary contains:

- `send_digits`
  - sends an `enter_digits` payload through `transmissionState`
- `send_text`
  - sends a `speak_text` payload through `transmissionState`
- `string_length`
  - returns character length for strict-length prompt handling
- `eval_js`
  - evaluates simple arithmetic expressions using `expr-eval`
  - normalizes `Math.floor(...)` to `floor(...)` before parsing

The tools themselves are intentionally thin; agent-level logging happens in `agentState`, not in the tool implementations.

## Transport

### `src/lib/console-actions.ts`

This file owns websocket connection lifecycle:

- opens the websocket with the configured `socketUrl`
- resets session-local state before reconnecting
- installs socket handlers for `open`, `close`, `error`, and `message`
- routes inbound `challenge` payloads through prompt reconstruction and transmission handling
- logs `success` and `error` payloads through `loggerState`

### `src/lib/protocol.ts`

This file contains:

- `reconstructMessage(fragments)` to sort fragments by ascending timestamp and join them into a prompt string

## Shared Types

### `src/lib/types.ts`

Key types:

- `Fragment`: one inbound NEON word fragment with a timestamp
- `EnterDigitsPayload`: outbound keypad payload
- `SpeakTextPayload`: outbound spoken-text payload
- `OutgoingPayload`: union of the two outbound payload shapes
- `JsonValue`: JSON-serializable metadata value
- `LogEntry`: one shared structured log entry with `type`, `timestamp`, `title`, and optional `metadata`
- `ReceivedMessage`: reconstructed inbound NEON message with original fragments attached

## UI Components

- `ConnectionPanel.svelte`
  - renders the top card with tabs for connection settings and agent settings
  - includes websocket URL, Neon Code, resume text, connect/disconnect controls, provider selection, API key, and model selection
  - also renders theme toggle and reference-docs button
- `SessionLog.svelte`
  - renders `loggerState.entries` as a dense text-style log
  - uses a grid layout for timestamp / expand-marker / type / message alignment
  - shows the first timestamp as absolute and subsequent timestamps relative to the previous row
  - only rows with metadata are expandable, shown with a leading `>` marker
- `ReferenceDocsDialog.svelte`
  - renders the mission and protocol docs in a tabbed dialog
- `MemoryPanel.svelte`
  - still exists in the codebase but is not currently mounted by the root page

## Styling

- Tailwind CSS v4 is configured in `src/routes/layout.css`.
- shadcn-svelte is the component layer used throughout the UI.
- `src/lib/components/ui/**` is excluded from linting and auto-formatting.
