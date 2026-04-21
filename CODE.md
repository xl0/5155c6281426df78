# Codebase State

## Overview

This repository is a SvelteKit app for the NEON authentication puzzle. The app acts as a websocket console that:

- connects to a NEON websocket endpoint
- reconstructs fragmented incoming challenges
- runs a client-side Pi agent against those challenges
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
- `src/routes/+layout.svelte` loads global styles, the favicon, `ModeWatcher`, and adds Wikipedia `dns-prefetch` / `preconnect` hints.
- `src/lib/state/settings.svelte.ts` defines persisted app and agent configuration and exports `settingsState`.
- `src/lib/state/ui.svelte.ts` defines volatile UI state and exports `uiState`.
- `src/lib/state/logger.svelte.ts` defines the shared structured log state and exports `loggerState`.
- `src/lib/state/transmission.svelte.ts` defines websocket transport state and exports `transmissionState`.
- `src/lib/state/agent.svelte.ts` defines the client-side Pi agent session state and exports `agentState`.
- `src/lib/state/index.ts` re-exports the instantiated states.
- `src/lib/console-actions.ts` owns websocket lifecycle setup and dispatches inbound messages into transmission and agent state.
- `src/lib/agent/tools.ts` exports the Pi tool list available to the agent.
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
  - `log(type, title, metadata?, level?)` appends timestamped log rows
  - each entry includes an explicit `level`: `normal`, `success`, `warning`, or `error`
- `transmission`
  - volatile transport state only: `connectionState`, current websocket reference, and a registered incoming handler
  - receives reconstructed inbound messages, logs them through `loggerState`, and forwards them to the registered async handler
  - sends outbound `enter_digits` / `speak_text` payloads directly and logs them as separate outbound event types
- `agent`
  - volatile agent session state: `pendingChallenges`, `isRunning`, and `lastError`
  - owns one Pi `Agent` instance per websocket session
  - keeps one provider `sessionId` per connection so repeated turns can reuse provider-side prompt caching
  - aborts the active run immediately after terminal send tools so the app can wait for the next NEON transmission instead of doing a post-send LLM turn

Behavior:

- `consoleActions.connect()` resets logger, transmission, and agent state before opening a new websocket session.
- Incoming websocket `challenge` payloads are reconstructed via `reconstructMessage(...)` and passed into `transmissionState.handleIncomingMessage(...)`.
- `transmissionState` logs inbound messages and forwards them to the registered handler.
- `agentState` enqueues incoming challenges and processes them sequentially.
- The agent uses one persistent Pi session per websocket connection, seeded once with the Neon Code and crew manifest.

## Agent

### `src/lib/state/agent.svelte.ts`

The agent layer uses `@mariozechner/pi-agent-core` with `@mariozechner/pi-ai` models.

Key behavior:

- validates that an API key is present before creating the agent session
- creates one Pi `Agent` lazily on the first challenge of a websocket session
- seeds the Pi message history once with:
  - `Neon Code`
  - `Crew Manifest / Resume`
- uses `thinkingLevel: 'off'`
- uses `toolExecution: 'sequential'`
- logs Pi lifecycle events through `loggerState`, including:
  - `message_start`
  - `message_end`
  - `tool_execution_start`
  - `tool_execution_end`
  - `turn_start`
  - `turn_end`
- treats send-capable tools as terminal for the current challenge and aborts the Pi run after they complete successfully
- ignores the expected assistant `aborted` message generated by that intentional terminal-tool shutdown
- serializes challenge processing with a simple FIFO queue

The system prompt is tailored for NEON-specific behavior, including:

- raw keypad entry via `send_digits`
- character-constrained speech via `send_text`
- direct arithmetic-to-keypad responses via `eval_and_send_digits`
- direct Wikipedia word lookup and send via `wiki_summary_send_word`
- direct prior-transmission word extraction via `transmit_nth_word`

### `src/lib/agent/tools.ts`

The exported `neonTools` list contains:

- `send_digits`
  - sends an `enter_digits` payload through `transmissionState`
  - intended for raw keypad input that should be sent unchanged, including hex auth codes
- `send_text`
  - sends a `speak_text` payload through `transmissionState`
  - accepts optional `minCharacters` / `maxCharacters`
  - crops or pads the outgoing text before sending
- `eval_and_send_digits`
  - evaluates a JavaScript-style arithmetic expression using `expr-eval`
  - normalizes `Math.floor(...)` to `floor(...)`
  - immediately sends the computed result as keypad digits
  - optionally appends `#`
- `wiki_summary_send_word`
  - fetches the real Wikipedia REST summary endpoint for a title
  - extracts the requested 1-based word
  - immediately sends that word as spoken text
- `transmit_nth_word`
  - extracts the requested 1-based word from a supplied prior transmission string
  - immediately sends that word as spoken text
  - if the requested index is out of range, sends the last available word instead

The tool implementations are intentionally thin around transmission, while tool results still include structured `details` for logging.

## Transport

### `src/lib/console-actions.ts`

This file owns websocket connection lifecycle:

- opens the websocket with the configured `socketUrl`
- resets session-local state before reconnecting
- installs socket handlers for `open`, `close`, `error`, and `message`
- routes inbound `challenge` payloads through prompt reconstruction and transmission handling
- logs `success` and `error` payloads through `loggerState`

### `src/lib/state/transmission.svelte.ts`

This file contains the thin transport methods used by tools and websocket handling:

- `handleIncomingMessage(text, fragments)` logs inbound reconstructed prompts and forwards them to the registered handler
- `sendDigits(digits)` sends `{ type: 'enter_digits', digits }`
- `sendText(text)` sends `{ type: 'speak_text', text }`
- both send methods throw if there is no active websocket connection
- outbound sends are logged as `transmission:out:digits` and `transmission:out:text`

### `src/lib/protocol.ts`

This file contains:

- `reconstructMessage(fragments)` to sort fragments by ascending timestamp and join them into a prompt string

## Shared Types

### `src/lib/types.ts`

Key types:

- `Fragment`: one inbound NEON word fragment with a timestamp
- `EnterDigitsPayload`: outbound keypad payload
- `SpeakTextPayload`: outbound spoken-text payload
- `JsonValue`: JSON-serializable metadata value
- `LogLevel`: `error | warning | normal | success`
- `LogEntry`: one shared structured log entry with `type`, `level`, `timestamp`, `title`, and optional `metadata`
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
  - colors rows from explicit log `level` values instead of inferring tone from log type
  - only rows with metadata are expandable, shown with a leading `>` marker
- `ReferenceDocsDialog.svelte`
  - renders the mission and protocol docs in a tabbed dialog
- `MemoryPanel.svelte`
  - still exists in the codebase but is not currently mounted by the root page

## Styling

- Tailwind CSS v4 is configured in `src/routes/layout.css`.
- shadcn-svelte is the component layer used throughout the UI.
- `src/routes/layout.css` defines shared semantic colors including `ok`, `warn`, and `fail` for the session log.
- `src/lib/components/ui/**` is excluded from linting and auto-formatting.
