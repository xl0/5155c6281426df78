## pruneMessages()

Filters an array of ModelMessage objects to reduce context size, remove intermediate reasoning, or trim tool calls and empty messages before sending to an LLM.

### Parameters

- `messages`: ModelMessage[] - Array of messages to prune
- `reasoning`: 'all' | 'before-last-message' | 'none' (default: 'none') - How to remove reasoning content from assistant messages
- `toolCalls`: 'all' | 'before-last-message' | 'before-last-${number}-messages' | 'none' | PruneToolCallsOption[] (default: 'none') - How to prune tool call/results/approval content; can specify strategy or per-tool list
- `emptyMessages`: 'keep' | 'remove' (default: 'remove') - Whether to keep or remove messages with empty content after pruning

### Returns

ModelMessage[] - The pruned list of messages

### Examples

```ts
import { pruneMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const prunedMessages = pruneMessages({
    messages,
    reasoning: 'before-last-message',
    toolCalls: 'before-last-2-messages',
    emptyMessages: 'remove',
  });

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: prunedMessages,
  });

  return result.toUIMessageStreamResponse();
}
```

```ts
const pruned = pruneMessages({
  messages,
  reasoning: 'all',
  toolCalls: 'before-last-message',
});
```

### Pruning Options

- **reasoning**: 'all' removes all reasoning parts; 'before-last-message' keeps reasoning only in the last message; 'none' retains all
- **toolCalls**: 'all' prunes all tool-call/result/approval chunks; 'before-last-message' prunes except in last message; 'before-last-N-messages' prunes except in last N messages; 'none' does not prune; or provide array for per-tool control
- **emptyMessages**: 'remove' (default) excludes messages with no content after pruning; 'keep' retains them

Typically used before sending context to an LLM to reduce message/token count after tool-calls and approvals.