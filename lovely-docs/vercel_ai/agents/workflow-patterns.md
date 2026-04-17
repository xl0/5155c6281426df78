## Workflow Patterns for Agents

Five core patterns for building reliable agent workflows:

### Sequential Processing (Chains)
Steps execute in order, each step's output feeds into the next. Use for well-defined sequences like content generation pipelines.

```ts
async function generateMarketingCopy(input: string) {
  const model = 'openai/gpt-4o';
  
  // Step 1: Generate copy
  const { text: copy } = await generateText({
    model,
    prompt: `Write persuasive marketing copy for: ${input}...`,
  });

  // Step 2: Quality check
  const { object: qualityMetrics } = await generateObject({
    model,
    schema: z.object({
      hasCallToAction: z.boolean(),
      emotionalAppeal: z.number().min(1).max(10),
      clarity: z.number().min(1).max(10),
    }),
    prompt: `Evaluate this marketing copy: ${copy}`,
  });

  // Step 3: Conditional regeneration
  if (!qualityMetrics.hasCallToAction || qualityMetrics.emotionalAppeal < 7 || qualityMetrics.clarity < 7) {
    const { text: improvedCopy } = await generateText({
      model,
      prompt: `Rewrite with improvements...`,
    });
    return { copy: improvedCopy, qualityMetrics };
  }
  return { copy, qualityMetrics };
}
```

### Routing
Model decides which path to take based on context. First LLM call's results determine subsequent call's model size and system prompt.

```ts
async function handleCustomerQuery(query: string) {
  // Classify query
  const { object: classification } = await generateObject({
    model: 'openai/gpt-4o',
    schema: z.object({
      type: z.enum(['general', 'refund', 'technical']),
      complexity: z.enum(['simple', 'complex']),
    }),
    prompt: `Classify this customer query: ${query}`,
  });

  // Route based on classification
  const { text: response } = await generateText({
    model: classification.complexity === 'simple' ? 'openai/gpt-4o-mini' : 'openai/o4-mini',
    system: {
      general: 'You are an expert customer service agent...',
      refund: 'You are a customer service agent specializing in refunds...',
      technical: 'You are a technical support specialist...',
    }[classification.type],
    prompt: query,
  });

  return { response, classification };
}
```

### Parallel Processing
Independent subtasks execute simultaneously. Example: parallel code review with specialized reviewers.

```ts
async function parallelCodeReview(code: string) {
  const [securityReview, performanceReview, maintainabilityReview] = await Promise.all([
    generateObject({
      model: 'openai/gpt-4o',
      system: 'You are an expert in code security...',
      schema: z.object({
        vulnerabilities: z.array(z.string()),
        riskLevel: z.enum(['low', 'medium', 'high']),
        suggestions: z.array(z.string()),
      }),
      prompt: `Review this code: ${code}`,
    }),
    generateObject({
      model: 'openai/gpt-4o',
      system: 'You are an expert in code performance...',
      schema: z.object({
        issues: z.array(z.string()),
        impact: z.enum(['low', 'medium', 'high']),
        optimizations: z.array(z.string()),
      }),
      prompt: `Review this code: ${code}`,
    }),
    generateObject({
      model: 'openai/gpt-4o',
      system: 'You are an expert in code quality...',
      schema: z.object({
        concerns: z.array(z.string()),
        qualityScore: z.number().min(1).max(10),
        recommendations: z.array(z.string()),
      }),
      prompt: `Review this code: ${code}`,
    }),
  ]);

  const { text: summary } = await generateText({
    model: 'openai/gpt-4o',
    system: 'You are a technical lead summarizing code reviews.',
    prompt: `Synthesize these results: ${JSON.stringify([...], null, 2)}`,
  });

  return { reviews: [...], summary };
}
```

### Orchestrator-Worker
Primary model (orchestrator) coordinates specialized workers. Each worker optimizes for a specific subtask while orchestrator maintains overall context.

```ts
async function implementFeature(featureRequest: string) {
  // Orchestrator: Plan
  const { object: implementationPlan } = await generateObject({
    model: 'openai/o4-mini',
    schema: z.object({
      files: z.array(z.object({
        purpose: z.string(),
        filePath: z.string(),
        changeType: z.enum(['create', 'modify', 'delete']),
      })),
      estimatedComplexity: z.enum(['low', 'medium', 'high']),
    }),
    system: 'You are a senior software architect...',
    prompt: `Analyze this feature request: ${featureRequest}`,
  });

  // Workers: Execute
  const fileChanges = await Promise.all(
    implementationPlan.files.map(async file => {
      const { object: change } = await generateObject({
        model: 'anthropic/claude-sonnet-4.5',
        schema: z.object({
          explanation: z.string(),
          code: z.string(),
        }),
        system: {
          create: 'You are an expert at implementing new files...',
          modify: 'You are an expert at modifying existing code...',
          delete: 'You are an expert at safely removing code...',
        }[file.changeType],
        prompt: `Implement changes for ${file.filePath}...`,
      });
      return { file, implementation: change };
    }),
  );

  return { plan: implementationPlan, changes: fileChanges };
}
```

### Evaluator-Optimizer
Dedicated evaluation steps assess intermediate results. Based on evaluation, workflow proceeds, retries with adjusted parameters, or takes corrective action.

```ts
async function translateWithFeedback(text: string, targetLanguage: string) {
  let currentTranslation = '';
  let iterations = 0;
  const MAX_ITERATIONS = 3;

  const { text: translation } = await generateText({
    model: 'openai/gpt-4o-mini',
    system: 'You are an expert literary translator.',
    prompt: `Translate to ${targetLanguage}: ${text}`,
  });
  currentTranslation = translation;

  while (iterations < MAX_ITERATIONS) {
    const { object: evaluation } = await generateObject({
      model: 'anthropic/claude-sonnet-4.5',
      schema: z.object({
        qualityScore: z.number().min(1).max(10),
        preservesTone: z.boolean(),
        preservesNuance: z.boolean(),
        culturallyAccurate: z.boolean(),
        specificIssues: z.array(z.string()),
        improvementSuggestions: z.array(z.string()),
      }),
      system: 'You are an expert in evaluating literary translations.',
      prompt: `Evaluate this translation: Original: ${text}, Translation: ${currentTranslation}`,
    });

    if (evaluation.qualityScore >= 8 && evaluation.preservesTone && evaluation.preservesNuance && evaluation.culturallyAccurate) {
      break;
    }

    const { text: improvedTranslation } = await generateText({
      model: 'anthropic/claude-sonnet-4.5',
      system: 'You are an expert literary translator.',
      prompt: `Improve based on feedback: ${evaluation.specificIssues.join('\n')}...`,
    });

    currentTranslation = improvedTranslation;
    iterations++;
  }

  return { finalTranslation: currentTranslation, iterationsRequired: iterations };
}
```

## Design Considerations

Choose approach based on:
- **Flexibility vs Control**: How much freedom does the LLM need vs how tightly you must constrain actions?
- **Error Tolerance**: What are consequences of mistakes?
- **Cost**: More complex systems mean more LLM calls
- **Maintenance**: Simpler architectures are easier to debug

Start with simplest approach that meets needs. Add complexity by breaking tasks into clear steps, adding tools for specific capabilities, implementing feedback loops, and introducing multiple agents.