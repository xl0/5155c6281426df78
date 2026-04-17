## Avatar Component

Displays user/entity images with automatic loading state handling and fallback placeholders.

### Features
- Smart image loading detection
- Fallback system for unavailable/slow images
- Compound component structure (Root, Image, Fallback)
- Customizable loading behavior

### Architecture
Three-part compound component:
- **Avatar.Root**: Container managing image state and fallback display
- **Avatar.Image**: Displays the image
- **Avatar.Fallback**: Shows during loading or on failure

### Basic Usage
```svelte
<script lang="ts">
  import { Avatar } from "bits-ui";
</script>
<Avatar.Root>
  <Avatar.Image src="https://github.com/huntabyte.png" alt="Huntabyte's avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

### Reusable Component Pattern
```svelte
<script lang="ts">
  import { Avatar, type WithoutChildrenOrChild } from "bits-ui";
  let {
    src,
    alt,
    fallback,
    ref = $bindable(null),
    imageRef = $bindable(null),
    fallbackRef = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<Avatar.RootProps> & {
    src: string;
    alt: string;
    fallback: string;
    imageRef?: HTMLImageElement | null;
    fallbackRef?: HTMLElement | null;
  } = $props();
</script>
<Avatar.Root {...restProps} bind:ref>
  <Avatar.Image {src} {alt} bind:ref={imageRef} />
  <Avatar.Fallback bind:ref={fallbackRef}>{fallback}</Avatar.Fallback>
</Avatar.Root>
```

Usage:
```svelte
<script lang="ts">
  import UserAvatar from "$lib/components/UserAvatar.svelte";
  const users = [
    { handle: "huntabyte", initials: "HJ" },
    { handle: "pavelstianko", initials: "PS" },
    { handle: "adriangonz97", initials: "AG" },
  ];
</script>
{#each users as user}
  <UserAvatar
    src="https://github.com/{user.handle}.png"
    alt="{user.name}'s avatar"
    fallback={user.initials}
  />
{/each}
```

### Skip Loading Check
For guaranteed-available images (local assets), bypass the loading check:
```svelte
<Avatar.Root loadingStatus="loaded">
  <Avatar.Image src={localAvatar} alt="User avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

### Clickable with Link Preview Example
```svelte
<script lang="ts">
  import { Avatar, LinkPreview } from "bits-ui";
  import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
  import MapPin from "phosphor-svelte/lib/MapPin";
</script>
<LinkPreview.Root>
  <LinkPreview.Trigger
    href="https://x.com/huntabyte"
    target="_blank"
    rel="noreferrer noopener"
    class="rounded-xs underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
  >
    <Avatar.Root class="data-[status=loaded]:border-foreground bg-muted text-muted-foreground h-12 w-12 rounded-full border border-transparent text-[17px] font-medium uppercase">
      <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent">
        <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
        <Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
      </div>
    </Avatar.Root>
  </LinkPreview.Trigger>
  <LinkPreview.Content class="border-muted bg-background shadow-popover w-[331px] rounded-xl border p-[17px]" sideOffset={8}>
    <div class="flex space-x-4">
      <Avatar.Root class="data-[status=loaded]:border-foreground bg-muted text-muted-foreground h-12 w-12 rounded-full border border-transparent text-[17px] font-medium uppercase">
        <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent">
          <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
          <Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
        </div>
      </Avatar.Root>
      <div class="space-y-1 text-sm">
        <h4 class="font-medium">@huntabyte</h4>
        <p>I do things on the internet.</p>
        <div class="text-muted-foreground flex items-center gap-[21px] pt-2 text-xs">
          <div class="flex items-center text-xs">
            <MapPin class="mr-1 size-4" />
            <span> FL, USA </span>
          </div>
          <div class="flex items-center text-xs">
            <CalendarBlank class="mr-1 size-4" />
            <span> Joined May 2020</span>
          </div>
        </div>
      </div>
    </div>
  </LinkPreview.Content>
</LinkPreview.Root>
```

### API Reference

**Avatar.Root**
| Property | Type | Description |
|----------|------|-------------|
| `loadingStatus` $bindable | 'loading' \| 'loaded' \| 'error' | Image loading status; bindable to track outside component |
| `onLoadingStatusChange` | (status: LoadingStatus) => void | Callback when loading status changes |
| `delayMs` | number | Delay (ms) before showing image after load; prevents flickering (default: 0) |
| `ref` $bindable | HTMLDivElement | DOM element reference |
| `children` | Snippet | Content to render |
| `child` | Snippet | Render delegation snippet |

Data attributes: `data-status` ('loading' \| 'loaded' \| 'error'), `data-avatar-root`

**Avatar.Image**
| Property | Type | Description |
|----------|------|-------------|
| `ref` $bindable | HTMLImageElement | DOM element reference |
| `children` | Snippet | Content to render |
| `child` | Snippet | Render delegation snippet |

Data attributes: `data-status` ('loading' \| 'loaded' \| 'error'), `data-avatar-image`

**Avatar.Fallback**
| Property | Type | Description |
|----------|------|-------------|
| `ref` $bindable | HTMLSpanElement | DOM element reference |
| `children` | Snippet | Content to render |
| `child` | Snippet | Render delegation snippet |

Data attributes: `data-status` ('loading' \| 'loaded' \| 'error'), `data-avatar-fallback`