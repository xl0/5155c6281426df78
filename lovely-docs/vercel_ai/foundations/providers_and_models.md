## Overview

The AI SDK provides a standardized interface for interacting with large language models (LLMs) from different providers through a unified language model specification. This abstraction layer allows switching between providers without changing application code, avoiding vendor lock-in.

## Architecture

The AI SDK uses a provider architecture that abstracts differences between provider APIs, enabling the same code to work across different LLM providers.

## Available Providers

**Official AI SDK Providers:**
- xAI Grok (`@ai-sdk/xai`)
- OpenAI (`@ai-sdk/openai`)
- Azure OpenAI (`@ai-sdk/azure`)
- Anthropic (`@ai-sdk/anthropic`)
- Amazon Bedrock (`@ai-sdk/amazon-bedrock`)
- Google Generative AI (`@ai-sdk/google`)
- Google Vertex (`@ai-sdk/google-vertex`)
- Mistral (`@ai-sdk/mistral`)
- Together.ai (`@ai-sdk/togetherai`)
- Cohere (`@ai-sdk/cohere`)
- Fireworks (`@ai-sdk/fireworks`)
- DeepInfra (`@ai-sdk/deepinfra`)
- DeepSeek (`@ai-sdk/deepseek`)
- Cerebras (`@ai-sdk/cerebras`)
- Groq (`@ai-sdk/groq`)
- Perplexity (`@ai-sdk/perplexity`)
- ElevenLabs (`@ai-sdk/elevenlabs`)
- LMNT (`@ai-sdk/lmnt`)
- Hume (`@ai-sdk/hume`)
- Rev.ai (`@ai-sdk/revai`)
- Deepgram (`@ai-sdk/deepgram`)
- Gladia (`@ai-sdk/gladia`)
- AssemblyAI (`@ai-sdk/assemblyai`)
- Baseten (`@ai-sdk/baseten`)

**OpenAI-Compatible Providers:**
- LM Studio
- Heroku

**Community Providers:**
- Ollama (`ollama-ai-provider`)
- FriendliAI (`@friendliai/ai-provider`)
- Portkey (`@portkey-ai/vercel-provider`)
- Cloudflare Workers AI (`workers-ai-provider`)
- OpenRouter (`@openrouter/ai-sdk-provider`)
- Aihubmix (`@aihubmix/ai-sdk-provider`)
- Requesty (`@requesty/ai-sdk`)
- Crosshatch (`@crosshatch/ai-provider`)
- Mixedbread (`mixedbread-ai-provider`)
- Voyage AI (`voyage-ai-provider`)
- Mem0 (`@mem0/vercel-ai-provider`)
- Letta (`@letta-ai/vercel-ai-sdk-provider`)
- Supermemory (`@supermemory/tools`)
- Spark (`spark-ai-provider`)
- AnthropicVertex (`anthropic-vertex-ai`)
- LangDB (`@langdb/vercel-provider`)
- Dify (`dify-ai-provider`)
- Sarvam (`sarvam-ai-provider`)
- Claude Code (`ai-sdk-provider-claude-code`)
- Built-in AI (`built-in-ai`)
- Gemini CLI (`ai-sdk-provider-gemini-cli`)
- A2A (`a2a-ai-provider`)
- SAP-AI (`@mymediset/sap-ai-provider`)
- AI/ML API (`@ai-ml.api/aimlapi-vercel-ai`)
- MCP Sampling (`@mcpc-tech/mcp-sampling-ai-provider`)
- ACP (`@mcpc-tech/acp-ai-provider`)

## Self-Hosted Models

Self-hosted models can be accessed via:
- Ollama
- LM Studio
- Baseten
- Built-in AI
- Any provider supporting OpenAI specification via OpenAI Compatible Provider

## Model Capabilities

Popular models and their capabilities:

| Provider | Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----------|-------|-------------|-------------------|------------|----------------|
| xAI Grok | grok-4, grok-3, grok-3-fast, grok-3-mini, grok-3-mini-fast, grok-2-1212, grok-beta | ✗ (except grok-2-vision-1212, grok-vision-beta) | ✓ | ✓ | ✓ |
| xAI Grok | grok-2-vision-1212, grok-vision-beta | ✓ | ✓ (except grok-vision-beta) | ✓ (except grok-vision-beta) | ✓ (except grok-vision-beta) |
| Vercel | v0-1.0-md | ✓ | ✓ | ✓ | ✓ |
| OpenAI | gpt-5, gpt-5-mini, gpt-5-nano, gpt-5.1-chat-latest, gpt-5.1-codex-mini, gpt-5.1-codex, gpt-5.1, gpt-5-codex, gpt-5-chat-latest | ✓ | ✓ | ✓ | ✓ |
| Anthropic | claude-opus-4-5, claude-opus-4-1, claude-opus-4-0, claude-sonnet-4-0, claude-3-7-sonnet-latest, claude-3-5-haiku-latest | ✓ | ✓ | ✓ | ✓ |
| Mistral | pixtral-large-latest, pixtral-12b-2409 | ✓ | ✓ | ✓ | ✓ |
| Mistral | mistral-large-latest, mistral-medium-latest, mistral-medium-2505, mistral-small-latest | ✗ | ✓ | ✓ | ✓ |
| Google Generative AI | gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| Google Vertex | gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| DeepSeek | deepseek-chat | ✗ | ✓ | ✓ | ✓ |
| DeepSeek | deepseek-reasoner | ✗ | ✗ | ✗ | ✗ |
| Cerebras | llama3.1-8b, llama3.1-70b, llama3.3-70b | ✗ | ✓ | ✓ | ✓ |
| Groq | meta-llama/llama-4-scout-17b-16e-instruct | ✓ | ✓ | ✓ | ✓ |
| Groq | llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768, gemma2-9b-it | ✗ | ✓ | ✓ | ✓ |

The language model specification is open-source and can be used to create custom providers.