## Model Type Incompatibility Error

When updating the AI SDK, you may encounter: `Type 'SomeModel' is not assignable to type 'LanguageModelV1'.`

Similar errors can occur with `EmbeddingModelV3`.

### Cause
New features are periodically added to the model specification, which can cause incompatibilities between older provider versions and newer SDK versions.

### Solution
Update both your provider packages and the AI SDK to the latest version to resolve the type mismatch.