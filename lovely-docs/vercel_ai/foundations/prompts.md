## Prompts

Prompts are instructions given to LLMs. The AI SDK supports three prompt types:

### Text Prompts
Simple string prompts, ideal for repeated generation with variants. Set via `prompt` property:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

// With template literals for dynamic data:
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: `I am planning a trip to ${destination} for ${lengthOfStay} days. Please suggest the best tourist activities for me to do.`,
});
```

### System Prompts
Initial instructions that guide model behavior. Set via `system` property, works with both `prompt` and `messages`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: `You help planning travel itineraries. Respond to the users' request with a list of the best stops to make in their destination.`,
  prompt: `I am planning a trip to ${destination} for ${lengthOfStay} days. Please suggest the best tourist activities for me to do.`,
});
```

### Message Prompts
Array of user, assistant, and tool messages for chat interfaces and complex multi-modal prompts. Set via `messages` property. Each message has `role` and `content`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy the best Currywurst in Berlin?' },
  ],
});
```

Content can be text string or array of parts (text, images, files, tool calls).

### Provider Options
Pass provider-specific metadata at three levels:

**Function level** - for general provider options:
```ts
const { text } = await generateText({
  model: azure('your-deployment-name'),
  providerOptions: {
    openai: { reasoningEffort: 'low' },
  },
});
```

**Message level** - for granular control:
```ts
const messages: ModelMessage[] = [
  {
    role: 'system',
    content: 'Cached system message',
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  },
];
```

**Message part level** - for specific content parts:
```ts
const messages: ModelMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Describe the image in detail.',
        providerOptions: { openai: { imageDetail: 'low' } },
      },
      {
        type: 'image',
        image: 'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true',
        providerOptions: { openai: { imageDetail: 'low' } },
      },
    ],
  },
];
```

### User Messages

**Text parts** - most common content type:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Where can I buy the best Currywurst in Berlin?' },
      ],
    },
  ],
});
```

**Image parts** - can be base64-encoded, binary (ArrayBuffer/Uint8Array/Buffer), or URL:
```ts
// Binary (Buffer):
{ type: 'image', image: fs.readFileSync('./data/comic-cat.png') }

// Base64 string:
{ type: 'image', image: fs.readFileSync('./data/comic-cat.png').toString('base64') }

// URL string:
{ type: 'image', image: 'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true' }

// URL object:
{ type: 'image', image: new URL('https://example.com/image.png') }
```

**File parts** - supported by Google Generative AI, Google Vertex AI, OpenAI (wav/mp3 audio, pdf), Anthropic. Requires MIME type:
```ts
// PDF from Buffer:
{
  type: 'file',
  mediaType: 'application/pdf',
  data: fs.readFileSync('./data/example.pdf'),
  filename: 'example.pdf', // optional
}

// MP3 audio from Buffer:
{
  type: 'file',
  mediaType: 'audio/mpeg',
  data: fs.readFileSync('./data/galileo.mp3'),
}
```

**Custom download function** (experimental) - implement throttling, retries, authentication, caching:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  experimental_download: async (
    requestedDownloads: Array<{
      url: URL;
      isUrlSupportedByModel: boolean;
    }>,
  ): PromiseLike<
    Array<{
      data: Uint8Array;
      mediaType: string | undefined;
    } | null>
  > => {
    // download files and return array with similar order
  },
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'file',
          data: new URL('https://api.company.com/private/document.pdf'),
          mediaType: 'application/pdf',
        },
      ],
    },
  ],
});
```

### Assistant Messages
Messages with role `assistant`, typically previous responses. Can contain text, reasoning, and tool call parts:

```ts
// Text content:
{ role: 'assistant', content: 'Hello, how can I help?' }

// Text in array:
{ role: 'assistant', content: [{ type: 'text', text: 'Hello, how can I help?' }] }

// Tool call content:
{
  role: 'assistant',
  content: [
    {
      type: 'tool-call',
      toolCallId: '12345',
      toolName: 'get-nutrition-data',
      input: { cheese: 'Roquefort' },
    },
  ],
}

// File content (model-generated, limited support):
{
  role: 'assistant',
  content: [
    {
      type: 'file',
      mediaType: 'image/png',
      data: fs.readFileSync('./data/roquefort.jpg'),
    },
  ],
}
```

### Tool Messages
For models supporting tool calls. Assistant messages contain tool call parts, tool messages contain tool output parts. Single assistant message can call multiple tools, single tool message can contain multiple results:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'How many calories are in this block of cheese?' },
        { type: 'image', image: fs.readFileSync('./data/roquefort.jpg') },
      ],
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          input: { cheese: 'Roquefort' },
        },
      ],
    },
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          output: {
            type: 'json',
            value: {
              name: 'Cheese, roquefort',
              calories: 369,
              fat: 31,
              protein: 22,
            },
          },
        },
      ],
    },
  ],
});
```

**Multi-modal tool results** (experimental, Anthropic only) - use `experimental_content` for multi-part results:
```ts
{
  role: 'tool',
  content: [
    {
      type: 'tool-result',
      toolCallId: '12345',
      toolName: 'get-nutrition-data',
      output: {
        type: 'json',
        value: { name: 'Cheese, roquefort', calories: 369, fat: 31, protein: 22 },
      },
    },
    {
      type: 'tool-result',
      toolCallId: '12345',
      toolName: 'get-nutrition-data',
      output: {
        type: 'content',
        value: [
          { type: 'text', text: 'Here is an image of the nutrition data for the cheese:' },
          {
            type: 'media',
            data: fs.readFileSync('./data/roquefort-nutrition-data.png').toString('base64'),
            mediaType: 'image/png',
          },
        ],
      },
    },
  ],
}
```

### System Messages
Messages sent before user messages to guide assistant behavior. Alternative to `system` property:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'system', content: 'You help planning travel itineraries.' },
    {
      role: 'user',
      content: 'I am planning a trip to Berlin for 3 days. Please suggest the best tourist activities for me to do.',
    },
  ],
});
```