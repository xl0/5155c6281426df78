## Changelog Entry Format

All changelog entries follow this structure:
```
- <type>(<scope>): <description>
```

### Type Categories
- `fix`: Resolves a bug or issue
- `feat`: Adds a new feature or enhancement (Minor or Major release)
- `improve`: Enhances existing functionality without fixing a bug
- `chore`: Internal refactors, cleanups, or tooling changes with no user-facing impact
- `docs`: Changes to documentation in the codebase (JSdoc comments); documentation site changes don't require entries

### Scope
- Use component name (e.g., `Select`, `Tooltip`, `Calendar`) for component-specific changes
- Use general terms (e.g., `all`, `SSR`) for multi-component or cross-cutting changes
- Omit scope only for truly global changes (rare)

### Description Guidelines
- Concise, lowercase phrase or sentence (no period)
- Start with a verb where possible (fix, add, ensure, expose)
- Use backticks for inline code: prop names, types, values (e.g., `disableOutsideDays`)
- Be specific; avoid vague terms unless clarified
- Target 10-15 words max

### Examples
```
fix(Select.Trigger): improve accessibility for screen readers and keyboard navigation

chore(Menubar.Content): simplify internal implementation for maintainability
fix(Menubar): prevent multiple submenus from opening simultaneously when too close

fix(Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true`
fix(Range Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true`
fix(Calendar): ensure default placeholder isn't a disabled date for keyboard navigation
```