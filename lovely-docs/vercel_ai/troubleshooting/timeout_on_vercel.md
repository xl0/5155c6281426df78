## Issue
Streaming responses get cut off and timeouts occur when deploying to Vercel, despite working locally.

## Root Cause
Vercel's Fluid Compute has a default function duration of 5 minutes (300 seconds) across all plans.

## Solution
Increase the `maxDuration` setting for longer-running processes.

### Next.js (App Router)
Add to your route file:
```tsx
export const maxDuration = 600;
```

### Other Frameworks
Set in `vercel.json`:
```json
{
  "functions": {
    "api/chat/route.ts": {
      "maxDuration": 600
    }
  }
}
```

## Plan Limits
- **Hobby**: Up to 300 seconds (5 minutes)
- **Pro**: Up to 800 seconds (~13 minutes)
- **Enterprise**: Up to 800 seconds (~13 minutes)

Note: Setting `maxDuration` above 300 seconds requires Pro or Enterprise plan.