AI SDK UI is a framework-agnostic toolkit for building interactive chat, completion, and assistant applications. It provides three main hooks:

- **useChat**: Real-time streaming of chat messages with state management for inputs, messages, loading, and errors
- **useCompletion**: Text completions with automatic UI updates as new completions stream
- **useObject**: Consume streamed JSON objects for structured data handling

Supported frameworks: React, Svelte, Vue.js, and Angular. Feature support varies by framework:
- useChat: All frameworks
- useCompletion: All frameworks
- useObject: React, Svelte, Angular (not Vue.js)

Example implementations available for Next.js, Nuxt, SvelteKit, and Angular.