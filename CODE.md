# Codebase State

## Overview

This repository is a SvelteKit app for the NEON authentication puzzle. The main UI is the root `/` page, which functions as a websocket console for connecting to NEON, receiving fragmented challenges, storing operator-provided reference data, configuring client-side agent settings, and showing session activity.

## Route

### `src/routes/+page.svelte`

The root page composes the console UI by rendering the top connection/settings card, session log, spoken memory panel, and reference docs dialog.

It includes:

- A top connection/settings card rendered by `ConnectionPanel.svelte`, with:
  - app title
  - dark-mode toggle
  - reference docs button
  - a Connection tab for websocket URL, Neon Code, crew manifest / resume, and connect controls
  - an Agent Settings tab for provider, per-provider API key, and model selection
  - connection status badge
- A main column with the session log
- A sidebar with the spoken-memory panel
- A modal dialog with the mission and protocol docs

## Architecture

- `src/routes/+page.svelte` wires together the console components.
- `src/lib/state/settings.svelte.ts` defines persisted app and agent configuration and exports `settingsState`.
- `src/lib/state/ui.svelte.ts` defines volatile UI state and exports `uiState`.
- `src/lib/state/transmission.svelte.ts` defines volatile websocket/session state and exports `transmissionState`.
- `src/lib/state/agent.svelte.ts` defines volatile agent-facing state and exports `agentState`.
- `src/lib/state/index.ts` re-exports the instantiated states.
- `src/lib/console-actions.ts` contains the cross-state websocket lifecycle actions.
- `src/lib/agent-settings.ts` defines supported AI providers, API-key placeholders, and model lists for the client-side agent settings UI.
- `src/lib/protocol.ts` provides prompt reconstruction for fragmented inbound messages.
- `src/lib/types.ts` defines shared data shapes for websocket payloads, session events, and spoken memory.
- `src/lib/components/*.svelte` contains the UI pieces used by the root page.
- `src/lib/components/ui/select/` contains the generated shadcn select primitive used by agent settings.
- `docs/resume.md` provides the default crew-manifest text loaded into persisted state on first use.
- `docs/misson.md` and `docs/protocol.txt` provide the reference material shown in the modal dialog.

## State Model

### `src/lib/state/*`

The app state is split into four instantiated singletons:

- `settings`
  - persisted browser state for `socketUrl`, `neonCode`, `resumeText`, `provider`, `apiKey`, and `model`
  - provider-aware derived values such as the current provider config and available models
- `ui`
  - volatile UI state for the reference docs dialog: `docsOpen` and `docsTab`
- `transmission`
  - volatile websocket and NEON session state: `connectionState`, `currentPrompt`, `currentFragments`, `sessionEvents`, and `spokenMemory`
  - state-local methods for session resets, socket bookkeeping, event logging, and transmission memory
- `agent`
  - volatile model-facing state: `messages` and `toolCalls`

Behavior:

- Opens and closes the websocket connection through `consoleActions`
- Reconstructs incoming prompts from timestamped fragments
- Stores session events and spoken memory inside `transmission`
- Reserves `agent` for future model messages and tool execution state
- Resets volatile agent and transmission session state when a new connection is opened

## Protocol Helper

### `src/lib/protocol.ts`

This file contains:

- `reconstructMessage(fragments)` to sort fragments by timestamp and join them into a prompt string

## Shared Types

### `src/lib/types.ts`

Key types:

- `Fragment`: one inbound NEON word fragment with a timestamp
- `EnterDigitsPayload`: outbound keypad payload
- `SpeakTextPayload`: outbound spoken-text payload
- `OutgoingPayload`: union of the two outbound payload shapes
- `SessionEvent`: one session log entry, optionally with original fragments
- `SpokenMemory`: saved pair of `{ prompt, text }` for prior spoken transmissions

## UI Components

- `ConnectionPanel.svelte` renders the top card and tabbed settings UI for connection fields and agent provider/API key/model selection.
  It also renders the top-card title row, theme toggle, and docs trigger.
- `SessionLog.svelte` renders the event timeline and shows raw incoming fragments in collapsible entries.
- `MemoryPanel.svelte` renders saved spoken transmissions used for later verification.
- `ReferenceDocsDialog.svelte` renders the mission and protocol docs in a wide modal with tabs.

## Styling

- Tailwind CSS v4 is configured in `src/routes/layout.css`.
- shadcn-svelte is the component layer used throughout the UI.
