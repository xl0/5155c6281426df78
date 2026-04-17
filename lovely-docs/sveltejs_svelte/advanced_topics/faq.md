## Getting Started
Start with the interactive tutorial at /tutorial. Each step focuses on one aspect. 5-10 minutes to get running, 1.5 hours for the full tutorial.

## Support Resources
- Reference docs at /docs/svelte for syntax questions
- Stack Overflow for code-level questions (tag: svelte)
- Discord or Reddit for discussions about best practices and architecture
- Svelte Society maintains a list of books and videos at sveltesociety.dev/resources

## Tooling
- VS Code: Use the official Svelte extension (svelte.svelte-vscode)
- Formatting: Use prettier with prettier-plugin-svelte

## Component Documentation
Use specially formatted comments in editors with Svelte Language Server:
```svelte
<script>
	/** What should we call the user? */
	export let name = 'world';
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```svelte
  <main name="Arethra">
  ```
-->
<main>
	<h1>Hello, {name}</h1>
</main>
```
Note: The `@component` tag is required in the HTML comment.

## Scaling
Check GitHub issue #2546 for discussion on Svelte's scalability.

## UI Component Libraries
Several UI component libraries and standalone components are listed on the packages page.

## Testing
Three types of tests for Svelte applications:

**Unit Tests**: Test business logic in isolation using test runners like Vitest. Extract logic from components to maximize coverage.

**Component Tests**: Validate component mounting and lifecycle using DOM tools. Options include jsdom + Vitest, Playwright, or Cypress.

**End-to-End Tests**: Test the full application in production-like conditions. Playwright is recommended for new SvelteKit projects.

Resources:
- Svelte docs on testing at /docs/svelte/testing
- Setup Vitest via Svelte CLI at /docs/cli/vitest
- Svelte Testing Library
- Cypress component testing for Svelte
- uvu test runner with JSDOM example
- Vitest & Playwright testing guide
- WebdriverIO component testing

## Routing
Official router: SvelteKit at /docs/kit. Provides filesystem routing, SSR, and HMR. Similar to Next.js (React) and Nuxt.js (Vue). Other routers available on packages page.

## Mobile Apps
- Turn a SvelteKit SPA into a mobile app with Tauri or Capacitor
- Mobile features (camera, geolocation, push notifications) available via plugins
- Custom renderer support in progress for Svelte 5 (not yet available)
- Svelte Native (for NativeScript) was available in Svelte 4 but not Svelte 5

## Unused Styles
Svelte removes unused styles to prevent scoping issues. Styles are scoped by adding a unique class to elements. If Svelte can't identify what a selector applies to at compile time, it can't safely keep it.

Use `:global(...)` to explicitly opt into global styles. Partial global selectors work: `.foo :global(.bar) { ... }` styles `.bar` elements within `.foo`.

## Svelte v2
No new features. Bugs fixed only if critical or security-related. Documentation available at v2.svelte.dev/guide.

## Hot Module Reloading
Use SvelteKit (built on Vite and svelte-hmr) for HMR out of the box. Community plugins available for rollup and webpack.