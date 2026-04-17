## Overview

The AI SDK consists of three main parts:

1. **AI SDK Core**: Unified, provider-agnostic API for generating text, structured objects, and tool calls with LLMs. Works in any JS environment (Node.js, Deno, Browser).

2. **AI SDK UI**: Framework-agnostic hooks for building chat and generative UIs. Supports React & Next.js, Vue & Nuxt, Svelte & SvelteKit. Provides production-ready utilities like `useChat`, `useCompletion`, `useObject` for handling common AI interaction patterns.

3. **AI SDK RSC**: Stream generative UIs from server to client using React Server Components. Currently experimental; recommended to use AI SDK UI for production instead.

## Environment Compatibility

| Environment | Core | UI | RSC |
|---|---|---|---|
| Node.js/Deno | ✓ | ✗ | ✗ |
| Vue/Nuxt | ✓ | ✓ | ✗ |
| Svelte/SvelteKit | ✓ | ✓ | ✗ |
| Next.js Pages Router | ✓ | ✓ | ✗ |
| Next.js App Router | ✓ | ✓ | ✓ |

## AI SDK UI Framework Support

| Function | React | Svelte | Vue.js |
|---|---|---|---|
| `useChat` | ✓ | ✓ | ✓ |
| `useChat` tool calling | ✓ | ✓ | ✗ |
| `useCompletion` | ✓ | ✓ | ✓ |
| `useObject` | ✓ | ✗ | ✗ |

## When to Use Each

**AI SDK Core**: Any JavaScript environment where you need to call LLMs with a unified API.

**AI SDK UI**: Building production-ready AI-native applications with streaming chat and generative UI. Offers full streaming support, common interaction patterns, and cross-framework compatibility.

**AI SDK RSC**: Streaming generative UIs from server to client in Next.js App Router. Has limitations: no stream cancellation via Server Actions, potential quadratic data transfer with `createStreamableUI`, component re-mounting/flickering during streaming. Use AI SDK UI for production instead.
