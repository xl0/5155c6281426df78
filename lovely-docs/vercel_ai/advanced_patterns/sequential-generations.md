## Sequential Generations (Chains)

Create sequences of dependent generations where each step's output becomes the next step's input.

### Example: Blog Post Workflow

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

async function sequentialActions() {
  // Step 1: Generate ideas
  const ideasGeneration = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Generate 10 ideas for a blog post about making spaghetti.',
  });

  // Step 2: Pick best idea (uses output from step 1)
  const bestIdeaGeneration = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: `Here are some blog post ideas about making spaghetti:
${ideasGeneration}

Pick the best idea from the list above and explain why it's the best.`,
  });

  // Step 3: Generate outline (uses output from step 2)
  const outlineGeneration = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: `We've chosen the following blog post idea about making spaghetti:
${bestIdeaGeneration}

Create a detailed outline for a blog post based on this idea.`,
  });
}

sequentialActions().catch(console.error);
```

Each `generateText()` call uses the previous generation's output embedded in the prompt string. This pattern enables breaking down complex tasks into smaller, dependent steps where later steps build on earlier results.