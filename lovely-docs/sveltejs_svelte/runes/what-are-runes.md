Runes are compiler-controlled symbols in Svelte that use a `$` prefix and look like function calls. They are keywords in the Svelte language, not regular JavaScript functions.

Key characteristics:
- No import needed — built into the language
- Not assignable values — cannot be assigned to variables or passed as function arguments
- Position-sensitive — only valid in certain contexts (compiler validates placement)
- Syntax example: `let message = $state('hello');`

Runes were introduced in Svelte 5 and did not exist in earlier versions.