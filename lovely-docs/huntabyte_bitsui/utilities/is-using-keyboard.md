## IsUsingKeyboard

A utility component that tracks whether the user is actively using the keyboard. Used internally by Bits UI components to provide keyboard accessibility features.

Provides global state shared across all instances to prevent duplicate event listener registration.

### Usage

```svelte
import { IsUsingKeyboard } from "bits-ui";
const isUsingKeyboard = new IsUsingKeyboard();
const shouldShowMenu = $derived(isUsingKeyboard.current);
```

Access the current keyboard usage state via the `current` property.