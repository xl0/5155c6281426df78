## Compiler API

The `svelte/compiler` module exports functions for programmatically compiling Svelte components and modules.

### Core Functions

**VERSION**: Current version string from package.json.

**compile(source, options)**: Converts `.svelte` source code into a JavaScript module exporting a component. Returns `CompileResult` with `js`, `css`, `warnings`, `metadata`, and `ast` properties.

**compileModule(source, options)**: Compiles JavaScript source containing runes into a JavaScript module. Returns `CompileResult`.

**parse(source, options)**: Parses a component and returns its AST. With `modern: true` returns modern AST format; without or `modern: false` returns legacy AST. Options include `filename` and `loose`.

**preprocess(source, preprocessor, options)**: Applies preprocessor hooks to transform component source code (e.g., converting `<style lang="sass">` to vanilla CSS). Accepts single or array of `PreprocessorGroup`. Returns `Promise<Processed>`.

**migrate(source, options)**: Best-effort migration of Svelte code to use runes, event attributes, and render tags. May throw on complex code. Options: `filename`, `use_ts`. Returns `{ code: string }`.

**walk()**: Deprecated—use `import { walk } from 'estree-walker'` instead.

### CompileOptions

Extends `ModuleCompileOptions` with:
- `name`: Component class name (inferred from filename if unspecified)
- `customElement`: Generate custom element constructor (default: false)
- `accessors`: Create getters/setters for props (default: false, deprecated in runes mode)
- `namespace`: Element namespace like "html", "svg", "mathml" (default: 'html')
- `immutable`: Promise not to mutate objects (default: false, deprecated in runes mode)
- `css`: 'injected' (in head/shadow root) or 'external' (returned in result, default: 'injected' for custom elements)
- `cssHash`: Function returning scoped CSS classname (default: `svelte-${hash(filename ?? css)}`)
- `preserveComments`: Keep HTML comments (default: false)
- `preserveWhitespace`: Keep whitespace as-is (default: false)
- `fragments`: 'html' (faster, uses template innerHTML) or 'tree' (slower, CSP-compatible, default: 'html')
- `runes`: true/false/undefined to force/disable/infer runes mode (default: undefined, will be true in Svelte 6)
- `discloseVersion`: Expose Svelte version in `window.__svelte.v` (default: true)
- `compatibility.componentApi`: 4 or 5 for Svelte 4 compatibility (default: 5)
- `sourcemap`: Initial sourcemap to merge
- `outputFilename`: For JavaScript sourcemap
- `cssOutputFilename`: For CSS sourcemap
- `hmr`: Enable hot reloading (default: false)
- `modernAst`: Return modern AST version (default: false, will be true in Svelte 6)

### ModuleCompileOptions

- `dev`: Add runtime checks and debugging (default: false)
- `generate`: 'client' (browser), 'server' (SSR), or false (no output, default: 'client')
- `filename`: For debugging and sourcemaps
- `rootDir`: Prevent filesystem info leakage (default: process.cwd())
- `warningFilter`: Function to filter warnings (return true to keep)
- `experimental.async`: Allow `await` in deriveds, template expressions, and component top level (v5.36+)

### CompileResult

- `js`: `{ code: string; map: SourceMap }`
- `css`: `null | { code: string; map: SourceMap; hasGlobal: boolean }`
- `warnings`: Array of warning objects with `code`, `message`, `start`, `end` properties
- `metadata`: `{ runes: boolean }` (true if compiled in runes mode)
- `ast`: The component AST

### Preprocessors

**PreprocessorGroup**: Object with optional `name`, `markup`, `style`, `script` properties.

**MarkupPreprocessor**: `(options: { content: string; filename?: string }) => Processed | void | Promise<Processed | void>`

**Preprocessor** (script/style): `(options: { content: string; attributes: Record<string, string | boolean>; markup: string; filename?: string }) => Processed | void | Promise<Processed | void>`

**Processed**: Result object with:
- `code`: The transformed code
- `map`: Optional source map
- `dependencies`: Optional list of files to watch
- `attributes`: Optional updated tag attributes (script/style only)
- `toString`: Optional string representation

### AST Types

The `AST` namespace contains comprehensive type definitions for the component AST, including:
- `Root`: Top-level node with `options`, `fragment`, `css`, `instance`, `module`, `comments`
- `Fragment`: Container with array of nodes
- `Text`, `ExpressionTag`, `HtmlTag`, `Comment`, `ConstTag`, `DebugTag`, `RenderTag`, `AttachTag`
- Element types: `Component`, `RegularElement`, `TitleElement`, `SlotElement`, `SvelteBody`, `SvelteComponent`, `SvelteDocument`, `SvelteElement`, `SvelteFragment`, `SvelteBoundary`, `SvelteHead`, `SvelteSelf`, `SvelteWindow`
- Block types: `EachBlock`, `IfBlock`, `AwaitBlock`, `KeyBlock`, `SnippetBlock`
- Directive types: `AnimateDirective`, `BindDirective`, `ClassDirective`, `LetDirective`, `OnDirective`, `StyleDirective`, `TransitionDirective`, `UseDirective`
- `Attribute`, `SpreadAttribute`, `Script`, `JSComment`

### Errors and Warnings

**CompileError**: Extends `ICompileDiagnostic`
**Warning**: Extends `ICompileDiagnostic`