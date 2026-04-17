## createIdGenerator()

Creates a customizable ID generator function with configurable alphabet, prefix, separator, and size.

**Import:**
```ts
import { createIdGenerator } from 'ai';
```

**Parameters (options object):**
- `alphabet` (string): Characters for random part. Defaults to alphanumeric (0-9, A-Z, a-z)
- `prefix` (string): String prepended to all IDs. Defaults to none
- `separator` (string): Character(s) between prefix and random part. Defaults to "-"
- `size` (number): Length of random part. Defaults to 16

**Returns:** Function that generates IDs based on configured options

**Examples:**
```ts
const generateCustomId = createIdGenerator({
  prefix: 'user',
  separator: '_',
});
const id = generateCustomId(); // "user_1a2b3c4d5e6f7g8h"

const generateUserId = createIdGenerator({
  prefix: 'user',
  separator: '_',
  size: 8,
});
const id1 = generateUserId(); // "user_1a2b3c4d"
```

**Notes:**
- Uses non-secure random generation, not for security-critical purposes
- Separator character must not be part of alphabet for reliable prefix checking