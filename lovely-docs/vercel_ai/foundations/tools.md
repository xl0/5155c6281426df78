## What is a tool?

A tool is an object that an LLM can invoke to perform discrete tasks and interact with the outside world. Tools are passed to `generateText` and `streamText` via the `tools` parameter.

A tool consists of three properties:
- **`description`**: Optional description influencing when the tool is picked
- **`inputSchema`**: Zod or JSON schema defining required input, consumed by the LLM and used to validate tool calls
- **`execute`**: Optional async function called with arguments from the tool call

When an LLM decides to use a tool, it generates a tool call. Tools with an `execute` function run automatically, and their output is returned as tool result objects. Tool results can be automatically passed back to the LLM using multi-step calls with `streamText` and `generateText`.

## Schemas

Schemas define tool parameters and validate tool calls. The AI SDK supports raw JSON schemas (using `jsonSchema` function) and Zod schemas (directly or using `zodSchema` function).

Install Zod:
```bash
pnpm add zod
npm install zod
yarn add zod
bun add zod
```

Example Zod schema:
```ts
import z from 'zod';

const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
});
```

Schemas can also be used with `generateObject` and `streamObject` for structured output generation.

## Tool Packages

Tools are JavaScript objects that can be packaged and distributed via npm.

### Using Ready-Made Tool Packages

Install and import tools:
```bash
pnpm add some-tool-package
```

```ts
import { generateText, stepCountIs } from 'ai';
import { searchTool } from 'some-tool-package';

const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'When was Vercel Ship AI?',
  tools: {
    webSearch: searchTool,
  },
  stopWhen: stepCountIs(10),
});
```

### Publishing Your Own Tools

Export tool objects from your package:
```ts
// my-tools/index.ts
export const myTool = {
  description: 'A helpful tool',
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    return result;
  },
};
```

Use the AI SDK Tool Package Template for a ready-to-use starting point.

## Toolsets

Ready-to-use tool packages:
- **@exalabs/ai-sdk** - Web search tool
- **@parallel-web/ai-sdk-tools** - Web search and extract tools
- **Stripe agent tools** - Stripe interactions
- **StackOne ToolSet** - Enterprise SaaS integrations
- **agentic** - 20+ tools connecting to Exa, E2B, etc.
- **AWS Bedrock AgentCore** - Browser runtime and code interpreter
- **Composio** - 250+ tools (GitHub, Gmail, Salesforce, etc.)
- **JigsawStack** - 30+ custom fine-tuned models
- **AI Tools Registry** - Shadcn-compatible tool definitions
- **Toolhouse** - 25+ actions in 3 lines of code

MCP server tools:
- **Smithery** - 6,000+ MCPs marketplace
- **Pipedream** - 3,000+ integrations
- **Apify** - Web scraping, data extraction, browser automation

Tool building tutorials:
- **browserbase** - Headless browser tools
- **browserless** - Browser automation integration
- **AI Tool Maker** - CLI to generate tools from OpenAPI specs
- **Interlify** - Convert APIs to tools
- **DeepAgent** - 50+ AI tools and integrations