## Generative Artificial Intelligence
Models that predict and generate outputs (text, images, audio) based on statistical patterns from training data. Examples: generating image captions from photos, transcriptions from audio, images from text descriptions.

## Large Language Models (LLM)
Subset of generative models focused on text. Takes a sequence of words as input and predicts the most likely sequence to follow by assigning probabilities to potential next sequences. Continues generating until a stopping criterion is met. Trained on massive text collections, so performance varies by domain (e.g., models trained on GitHub understand source code patterns well). Key limitation: hallucination—when asked about unknown or absent information, LLMs may fabricate answers. Effectiveness depends on how well the required information is represented in the training data.

## Embedding Models
Convert complex data (words, images) into dense vector representations (lists of numbers). Unlike generative models, they don't generate new text/data but provide semantic and syntactic relationship representations usable as input for other models or NLP tasks.