## Expo Quickstart

Build a streaming chat UI with Expo and the AI SDK.

### Prerequisites
- Node.js 18+, pnpm
- Vercel AI Gateway API key

### Setup
```bash
pnpm create expo-app@latest my-ai-app
cd my-ai-app
pnpm add ai@beta @ai-sdk/react@beta zod
```

Create `.env.local`:
```env
AI_GATEWAY_API_KEY=xxxxxxxxx
```

### API Route
Create `app/api/chat+api.ts`:
```tsx
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
```

The `streamText` function accepts model and messages, returns `StreamTextResult` with `toUIMessageStreamResponse()` method to stream to client.

### UI with useChat Hook
Update `app/(tabs)/index.tsx`:
```tsx
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';
import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';

export default function App() {
  const [input, setInput] = useState('');
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <View style={{ height: '95%', display: 'flex', flexDirection: 'column', paddingHorizontal: 8 }}>
        <ScrollView style={{ flex: 1 }}>
          {messages.map(m => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <Text style={{ fontWeight: 700 }}>{m.role}</Text>
              {m.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                }
              })}
            </View>
          ))}
        </ScrollView>
        <View style={{ marginTop: 8 }}>
          <TextInput
            style={{ backgroundColor: 'white', padding: 8 }}
            placeholder="Say something..."
            value={input}
            onChange={e => setInput(e.nativeEvent.text)}
            onSubmitEditing={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
            autoFocus={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
```

`useChat` hook provides `messages` (array with id, role, parts), `sendMessage` function, and `error`. Messages have `parts` array containing text, reasoning tokens, and tool results in generation order. Use `expo/fetch` instead of native fetch for streaming (requires Expo 52+).

### API URL Generator
Create `utils.ts`:
```ts
import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  const origin = Constants.experienceUrl.replace('exp://', 'http://');
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  if (process.env.NODE_ENV === 'development') {
    return origin.concat(path);
  }
  
  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL environment variable is not defined');
  }
  
  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};
```

Handles URL generation for dev and production. Set `EXPO_PUBLIC_API_BASE_URL` before deploying.

### Run
```bash
pnpm expo
```
Open http://localhost:8081

### Tools
Add tools to enable LLM to invoke actions. Update `app/api/chat+api.ts`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return { location, temperature };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        inputSchema: z.object({
          temperature: z.number().describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return { celsius };
        },
      }),
    },
  });
  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
```

Tool definition includes description, `inputSchema` (Zod schema for inputs), and async `execute` function. Tool parts are named `tool-{toolName}`. `stopWhen: stepCountIs(5)` allows model to use up to 5 steps, enabling multi-step tool calls where model can use tool results to trigger additional generations.

Update UI to display tool results:
```tsx
{m.parts.map((part, i) => {
  switch (part.type) {
    case 'text':
      return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
    case 'tool-weather':
    case 'tool-convertFahrenheitToCelsius':
      return <Text key={`${m.id}-${i}`}>{JSON.stringify(part, null, 2)}</Text>;
  }
})}
```

### Polyfills
For missing runtime functions, install:
```bash
pnpm add @ungap/structured-clone @stardazed/streams-text-encoding
```

Create `polyfills.js`:
```ts
import { Platform } from 'react-native';
import structuredClone from '@ungap/structured-clone';

if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import('react-native/Libraries/Utilities/PolyfillFunctions');
    const { TextEncoderStream, TextDecoderStream } = await import('@stardazed/streams-text-encoding');
    
    if (!('structuredClone' in global)) {
      polyfillGlobal('structuredClone', () => structuredClone);
    }
    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  };
  setupPolyfills();
}
export {};
```

Import in `_layout.tsx`:
```ts
import '@/polyfills';
```