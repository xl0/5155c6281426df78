## TypeScript Performance Issues with Zod

When using AI SDK 5 with Zod, you may encounter:
- TypeScript server crashes or hangs
- Extremely slow type checking in files importing AI SDK functions
- "Type instantiation is excessively deep and possibly infinite" errors
- IDE becoming unresponsive

### Root Cause
AI SDK 5 has specific compatibility requirements with Zod versions. Using the standard import path (`import { z } from 'zod'`) can cause TypeScript's type inference to become excessively complex due to different module resolution settings causing Zod declarations to load twice, leading to expensive structural comparisons.

### Solutions

**Primary: Upgrade Zod**
```bash
pnpm add zod@^4.1.8
```
Zod 4.1.8+ includes a fix for the module resolution issue.

**Alternative: Update TypeScript Configuration**
If upgrading Zod isn't possible, update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "moduleResolution": "nodenext"
  }
}
```
This resolves performance issues while keeping the standard Zod import.