## What is a Large Language Model (LLM)?

LLMs are prediction engines that take word sequences as input and predict the most likely sequences to follow by assigning probabilities. They generate text until meeting a stopping criterion. Trained on massive text corpuses, they excel at some use cases better than others (e.g., models trained on GitHub understand code well). Generated sequences can seem plausible but may not be grounded in reality.

## What is a prompt?

Prompts are starting points for LLMs—inputs that trigger text generation. Prompt engineering encompasses crafting prompts and understanding related concepts: hidden prompts, tokens, token limits, and prompt hacking (jailbreaks, leaks).

## Why is prompt engineering needed?

Prompt engineering shapes LLM responses and enables tweaking models for broader query ranges using techniques like semantic search, command grammars, and ReActive architecture. Different models have varying performance, context windows, and costs (e.g., GPT-4 is more expensive and slower than GPT-3.5-turbo but more effective at certain tasks). Trade-offs exist between cost and performance.

## Example: Slogan Generator

**Start with an instruction:**
- Basic: `Create a slogan for a coffee shop.`
- More specific: `Create a slogan for an organic coffee shop.`

Adding descriptive terms influences completions—prompts "instruct" or "program" the model.

**Include examples:**
- Simple request: `Create three slogans for a coffee shop with live music.` (model may miss details)
- With examples:
```
Create three slogans for a business with unique features.

Business: Bookstore with cats
Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles"
Business: Gym with rock climbing
Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit"
Business: Coffee shop with live music
Slogans:
```

Demonstrating expected output patterns helps the model generate better results.

**Tweak settings:**

Temperature (0 to 1) governs model confidence in predictions:
- Temperature 0: Same prompt yields identical/nearly identical completions (deterministic)
- Temperature > 0: Same prompt yields varied completions (creative)
- Lower temperature: More precise, deterministic completions
- Higher temperature: Broader range of completions

For a slogan generator needing diverse suggestions, use moderate temperature around 0.6.