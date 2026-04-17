## AI State

**Saving AI state** uses the `onSetAIState` callback, invoked whenever AI state updates:

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: { continueConversation },
  onSetAIState: async ({ state, done }) => {
    'use server';
    if (done) saveChatToDB(state);
  },
});
```

**Restoring AI state** uses the `initialAIState` prop on the context provider:

```tsx
export default async function RootLayout({ children }) {
  const chat = await loadChatFromDB();
  return (
    <html>
      <body>
        <AI initialAIState={chat}>{children}</AI>
      </body>
    </html>
  );
}
```

## UI State

**Saving UI state** is not directly possible since contents aren't serializable. Use AI state as a proxy to store UI state details.

**Restoring UI state** uses the `onGetUIState` callback to listen for SSR events and restore UI from AI state:

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: { continueConversation },
  onGetUIState: async () => {
    'use server';
    const historyFromDB = await loadChatFromDB();
    const historyFromApp = getAIState();

    if (historyFromDB.length !== historyFromApp.length) {
      return historyFromDB.map(({ role, content }) => ({
        id: generateId(),
        role,
        display: role === 'function' ? <Component {...JSON.parse(content)} /> : content,
      }));
    }
  },
});
```

Note: AI SDK RSC is experimental; use AI SDK UI for production.