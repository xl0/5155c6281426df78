## Common Settings

All AI SDK functions support these settings alongside model and prompt:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  maxOutputTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Note:** Some providers don't support all settings; check the `warnings` property in results.

## Output Control

- **`maxOutputTokens`**: Maximum tokens to generate.
- **`temperature`**: Controls randomness (0 = deterministic, higher = more random). Range depends on provider. Don't set both `temperature` and `topP`.
- **`topP`**: Nucleus sampling (typically 0-1, e.g., 0.1 = top 10% probability mass). Don't set both `temperature` and `topP`.
- **`topK`**: Sample only from top K options per token. Removes low-probability responses; for advanced use only.
- **`stopSequences`**: Array of sequences that stop generation when encountered. Providers may limit count.
- **`seed`**: Integer seed for deterministic results if supported by model.

## Penalties

- **`presencePenalty`**: Reduces likelihood of repeating information already in prompt (0 = no penalty).
- **`frequencyPenalty`**: Reduces likelihood of reusing same words/phrases (0 = no penalty).

## Request Control

- **`maxRetries`**: Maximum retry attempts. Default: 2. Set to 0 to disable.
- **`abortSignal`**: Cancel calls or set timeout:
  ```ts
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Invent a new holiday and describe its traditions.',
    abortSignal: AbortSignal.timeout(5000), // 5 seconds
  });
  ```

- **`headers`**: Additional HTTP headers for HTTP-based providers:
  ```ts
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Invent a new holiday and describe its traditions.',
    headers: { 'Prompt-Id': 'my-prompt-id' },
  });
  ```
  Can also set headers in provider configuration for all requests.