## AI_InvalidPromptError

Thrown when an invalid prompt is provided to functions like `streamText` or `generateText`.

### Common Cause: UIMessage[] Instead of ModelMessage[]

The most common cause is passing `UIMessage[]` directly instead of converting to `ModelMessage[]` first.

**Solution:** Use `convertToModelMessages()` to convert:

```typescript
import { type UIMessage, generateText, convertToModelMessages } from 'ai';

const messages: UIMessage[] = [/* ... */];
const result = await generateText({
  // ...
  messages: convertToModelMessages(messages),
});
```

### Error Properties

- `prompt`: The invalid prompt value
- `message`: The error message
- `cause`: The underlying cause

### Type Checking

```typescript
import { InvalidPromptError } from 'ai';

if (InvalidPromptError.isInstance(error)) {
  // Handle the error
}
```