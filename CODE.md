# Codebase State

## Overview

This is a small SvelteKit app for working on the NEON authentication puzzle. The main product surface is now the root `/` page, which acts as a websocket-based operator console for receiving challenges, drafting responses, and tracking session state.

## Routes

### `src/routes/+page.svelte`

Primary application UI.

Current responsibilities:

- Connect to `wss://neonhealth.software/agent-puzzle/challenge`
- Accept Neon Code and pasted resume / crew manifest input
- Reconstruct incoming fragmented transmissions by sorting fragments by timestamp
- Parse and classify common prompt types
- Auto-draft answers for:
  - keypad / frequency prompts
  - arithmetic prompts including `Math.floor`
  - Wikipedia knowledge-archive prompts
  - some final verification prompts based on previously sent spoken answers
- Validate outgoing `speak_text` length constraints inferred from prompt text
- Send `enter_digits` and `speak_text` websocket payloads
- Persist spoken-response memory for later verification checkpoints
- Show session history
- Show incoming transmission fragments only inside collapsible session-log entries
- Show the mission / protocol docs inside a modal dialog instead of inline on the page
- Provide a dark-mode toggle

UI structure on `/`:

- Header card:
  - app title and description
  - dark-mode toggle
  - reference docs button
  - connection status badge
  - websocket URL input
  - Neon Code input
  - resume textarea
  - connect / disconnect actions
- Main column:
  - response composer card
  - session log card
- Sidebar:
  - memory card with previously spoken transmissions
- Modal:
  - mission / protocol docs in tabs with scrollable content

## Architecture

- `src/routes/+page.svelte` is now a composition-only route that wires together the console UI components.
- `src/lib/console-state.svelte.ts` owns the app's mutable websocket/session state using Svelte 5 runes.
- `src/lib/protocol.ts` contains pure parsing and drafting helpers for reconstructed NEON prompts.
- `src/lib/types.ts` defines the shared domain model used by both state and UI.
- `src/lib/components/*.svelte` contains presentational pieces for the console layout.

## Shared Types

### `src/lib/types.ts`

This file is the shared contract for the NEON console. It keeps websocket payloads, parsed prompt state, session history, and memory records aligned across the protocol helpers, state class, and Svelte components.

#### `Fragment`

- Shape of a single inbound transmission fragment from NEON.
- Used by `reconstructMessage(...)` in `src/lib/protocol.ts`.
- Also attached to `SessionEvent.fragments` so the UI can show the raw challenge pieces in the session log.

#### `EnterDigitsPayload`

- Outbound websocket payload for keypad-style responses.
- Sent when NEON expects numeric entry such as frequencies, handshake values, arithmetic results, or the Neon Code.

#### `SpeakTextPayload`

- Outbound websocket payload for spoken/text responses.
- Sent for knowledge archive answers, crew manifest answers, and verification answers.

#### `OutgoingPayload`

- Union of `EnterDigitsPayload | SpeakTextPayload`.
- Represents every valid outbound message the console can send.
- `ParsedChallenge.mode` narrows to `OutgoingPayload['type']`, so drafting logic can tell the composer which response mode to use.

#### `SessionEvent`

- Log entry type for the session timeline.
- `kind` drives the visual treatment of status, incoming, outgoing, error, and success entries.
- `fragments` is only present for incoming challenge events, which lets the session log show both the reconstructed prompt and the sorted raw fragments.

#### `ParsedChallenge`

- Result of classifying a reconstructed NEON prompt.
- Produced by `buildAdvice(...)` in `src/lib/protocol.ts`.
- Consumed by `NeonDevConsoleState` to update the composer.
- Fields:
  - `mode`: recommended response mode, or `null` when manual review is required
  - `label`: human-readable checkpoint classification
  - `notes`: operator guidance for why the prompt was classified that way
  - `draft`: prefilled response text/digits
  - `auto`: whether the draft was prepared automatically

#### `SpokenMemory`

- Record of a previously sent `speak_text` response together with the prompt that produced it.
- Stored in state after successful outbound spoken transmissions.
- Used later by verification logic to answer prompts asking for a specific word from an earlier transmission.

#### `CharacterConstraint`

- Normalized form of prompt-imposed text-length rules.
- Extracted from prompt text by `parseCharacterConstraint(...)` in `src/lib/protocol.ts`.
- Used by state and UI to validate `speak_text` responses before sending and to display current constraints in the composer.

## Type Relationships

- Inbound flow:
  - NEON sends `Fragment[]`
  - `reconstructMessage(...)` turns those fragments into a prompt string
  - `buildAdvice(...)` returns a `ParsedChallenge`
  - `NeonDevConsoleState` uses that `ParsedChallenge` to set composer mode, notes, and draft value
- Outbound flow:
  - The composer edits either digits or text
  - State packages that as an `OutgoingPayload`
  - If the payload is `SpeakTextPayload`, state also saves a `SpokenMemory` entry
- Logging flow:
  - Every notable socket action is stored as a `SessionEvent`
  - Incoming challenge events may retain their original `Fragment[]` for inspection in the UI
- Validation flow:
  - Prompt text may produce a `CharacterConstraint`
  - That constraint is applied to outgoing `SpeakTextPayload` values before transmit

## Styling / UI

- Tailwind CSS v4 is configured in `src/routes/layout.css`
- shadcn-svelte has been initialized and is the preferred component layer

## Current Limitations

- Crew-manifest answers are still primarily manual; the page stores the resume for operator reference but does not yet synthesize resume-based answers automatically
- Arithmetic evaluation is intentionally narrow and regex-gated
- Verification prompt parsing is heuristic and may need refinement for additional prompt shapes
- The docs source file is currently named `docs/misson.md`
