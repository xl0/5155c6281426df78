We maintain 2 important files besides `CLAUDE.md`:

- `CODE.md`: An in-depth summary of the current state of the codebase.
- `PLAN.md`: Planning for the codebase. Contains both high-level birds eye view plan, as well as a lower-level todo.

IMPORTANT: At the start of each conversation, always fully read `CODE.md`. You may read `PLAN.md` when relevant to the task.
You may update the files as you go, but keep the updates concise.
Don't turn it into a changelog - only reflect the current state, not history.

## Guidelines

- Always use bun/bunx, not npm
- Don't do excessive speculative try/catch with fall-backs. Only catch real errors, and default to a clear fail/error message, don't implement fallback solutions.
  If we are adding experimental features, no need to gate them - we can always just remove them later.
- Avoid shallow abstractions. Avoid single-use abstractions.
- Don't keep legacy interface/formats around - this is an MVP, there is not need for backwards compat at all.
- You may install packages, double-check with the user if unprompted.
- When using shadcn-svelte UI primitives, prefer installing the generated component into `src/lib/components/ui/` and using it as-is rather than hand-rolling replacements from primitives.

- Use small edits where possible. Unless you are really replacing the whole file content, edit the file, don't delete and rewrite from scratch.
- Don't use sed or other hacks to edit files. Re-read and retry using tools.

- Keep the end of turn summaries very concise.
- No need to git diff at the end of the turn.

## WebDev

### Running the checks

- Run `bun run check` after any changes that have any chance of breaking things.
- Run `agent-browser` after major changes only:

  > agent-browser console --clear && agent-browser errors --clear
  > agent-browser navigate ...
  > agent-browser console && agent-browser errors

- Unless you are debuggin an active issue, just do a quick check - no screenshots, no or minimal navigation.

Note: we likely already have a dev server running on localhost:5173. If not, don't start the server, ask the user to do so.

### UI

- Keep it clean, err on the side of minimalism.
- Avoid adding custom colors, styles or fonts per element - use the one pre-defined in layout.css
- Avoid arbitrary Tailwind values unless there is a concrete layout need.

## Lovely Docs

The current project will have documentation for many libraries inside ./lovely-docs/.
IMPORTANT: At the START of EVERY session, find all ./lovely-docs/\*/`LLM_MAP.md` and read them.
If documentation exists for a library you're about to use, always read the relevant sections before using a feature for the first time.
