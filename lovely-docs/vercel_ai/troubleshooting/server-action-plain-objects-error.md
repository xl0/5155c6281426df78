## Problem
When using `streamText` or `streamObject` with Server Actions, you get an error: `"only plain objects and a few built ins can be passed from client components"`. This occurs because these functions return non-serializable objects with methods and complex structures that cannot be passed from Server Actions to Client Components.

## Solution
Extract only serializable data from the Server Action result instead of returning the entire object. Use `createStreamableValue` to wrap the data so it can be safely passed to the client.

The key is ensuring only serializable data (like plain text) crosses the Server Action boundary, not objects with methods or complex internal structures.