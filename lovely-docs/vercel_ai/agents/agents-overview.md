## Agents

Agents are LLMs that use tools in a loop to accomplish tasks. Three components work together:
- **LLMs** process input and decide the next action
- **Tools** extend capabilities (reading files, calling APIs, writing to databases)
- **Loop** orchestrates execution through context management and stopping conditions

### ToolLoopAgent Class

The ToolLoopAgent class handles these three components:

```ts
import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { z } from 'zod';

const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location (in Fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert temperature from Fahrenheit to Celsius',
      inputSchema: z.object({
        temperature: z.number().describe('Temperature in Fahrenheit'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
  stopWhen: stepCountIs(20),
});

const result = await weatherAgent.generate({
  prompt: 'What is the weather in San Francisco in celsius?',
});

console.log(result.text); // agent's final answer
console.log(result.steps); // steps taken by the agent
```

The agent automatically calls tools in sequence and generates a final response. The Agent class handles the loop, context management, and stopping conditions.

### Why Use the Agent Class

- **Reduces boilerplate** - Manages loops and message arrays
- **Improves reusability** - Define once, use throughout your application
- **Simplifies maintenance** - Single place to update agent configuration

For most use cases, start with the Agent class. Use core functions (`generateText`, `streamText`) when you need explicit control over each step for complex structured workflows.

### Structured Workflows

Agents are non-deterministic. For reliable, repeatable outcomes with explicit control flow, use core functions with structured workflow patterns combining conditional statements, standard functions, error handling, and explicit control flow.