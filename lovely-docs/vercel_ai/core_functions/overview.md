## AI SDK Core

AI SDK Core simplifies working with Large Language Models (LLMs) by providing a standardized interface for integrating them into applications, allowing developers to focus on building AI features rather than handling technical details.

### Core Functions

**Text Generation:**
- `generateText`: Generates text and tool calls for non-interactive use cases like automation, email drafting, web page summarization, and agents using tools.
- `streamText`: Streams text and tool calls for interactive use cases like chatbots and content streaming.

**Structured Data Generation:**
- `generateObject`: Generates typed, structured objects matching a Zod schema. Use for information extraction, synthetic data generation, or classification tasks.
- `streamObject`: Streams structured objects matching a Zod schema. Use for streaming generated UIs.

All functions use standardized approaches for setting up prompts and settings, making it easier to work with different models.