## Setup with SvelteKit (Recommended)

The official way to start a new Svelte project:

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

SvelteKit is the official application framework from the Svelte team, powered by Vite, and supports building almost any type of application.

## Alternatives to SvelteKit

**Vite with Svelte plugin:**
```sh
npm create vite@latest
# select svelte option
npm run build  # generates HTML, JS, CSS in dist/
```

Uses vite-plugin-svelte. Most projects will need a separate routing library.

Vite can be used in standalone mode for single page apps (SPAs), which SvelteKit also supports.

Other bundlers have plugins available, but Vite is recommended.

## Editor Tooling

- VS Code extension maintained by Svelte team
- Integrations available for various other editors
- Command-line checking: `sv check`

## Getting Help

- Discord chatroom for community support
- Stack Overflow for Q&A (tag: svelte)