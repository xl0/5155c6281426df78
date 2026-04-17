# Codebase State

## Overview

This is a small SvelteKit app for working on the NEON authentication puzzle. The main product surface is a `/dev` page that acts as a websocket-based operator console for receiving challenges, drafting responses, and tracking session state.

## Routes

### `src/routes/+page.svelte`

Minimal landing page with a shadcn `Card` and button linking to `/dev`.

### `src/routes/dev/+page.svelte`

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

UI structure on `/dev`:

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

## Styling / UI

- Tailwind CSS v4 is configured in `src/routes/layout.css`
- shadcn-svelte has been initialized and is the preferred component layer
- Dark mode is enabled through CSS variables and `mode-watcher`
- `ModeWatcher` is mounted in `src/routes/+layout.svelte`

Generated shadcn components currently in use:

- `badge`
- `button`
- `card`
- `dialog`
- `input`
- `scroll-area`
- `separator`
- `tabs`
- `textarea`

## Dependencies Relevant To The App

- `shadcn-svelte`
- `bits-ui`
- `mode-watcher`
- `@lucide/svelte`

## Current Limitations

- Crew-manifest answers are still primarily manual; the page stores the resume for operator reference but does not yet synthesize resume-based answers automatically
- Arithmetic evaluation is intentionally narrow and regex-gated
- Verification prompt parsing is heuristic and may need refinement for additional prompt shapes
- The docs source file is currently named `docs/misson.md`
