## Issue
When using the AI SDK in non-React projects (e.g., Hono servers), TypeScript throws: `error TS2503: Cannot find namespace 'JSX'.`

## Root Cause
The AI SDK depends on `@types/react`, which defines the JSX namespace. This dependency will be removed in the next major version.

## Solution
Install `@types/react` as a dependency:
```bash
npm install @types/react
```