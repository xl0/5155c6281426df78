## Pagination Component

Enables users to navigate through a series of pages.

### Basic Usage

```svelte
<script lang="ts">
  import { Pagination } from "bits-ui";
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
</script>

<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, range })}
    <div class="flex items-center">
      <Pagination.PrevButton>
        <CaretLeft />
      </Pagination.PrevButton>
      <div class="flex gap-2.5">
        {#each pages as page (page.key)}
          {#if page.type === "ellipsis"}
            <div>...</div>
          {:else}
            <Pagination.Page {page}>
              {page.value}
            </Pagination.Page>
          {/if}
        {/each}
      </div>
      <Pagination.NextButton>
        <CaretRight />
      </Pagination.NextButton>
    </div>
    <p>Showing {range.start} - {range.end}</p>
  {/snippet}
</Pagination.Root>
```

### Structure

```svelte
<Pagination.Root let:pages>
  <Pagination.PrevButton />
  {#each pages as page (page.key)}
    <Pagination.Page {page} />
  {/each}
  <Pagination.NextButton />
</Pagination.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myPage = $state(1);
</script>
<button onclick={() => (myPage = 2)}>Go to page 2</button>
<Pagination.Root bind:page={myPage}>
  <!-- ... -->
</Pagination.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myPage = $state(1);
  function getPage() { return myPage; }
  function setPage(newPage: number) { myPage = newPage; }
</script>
<Pagination.Root bind:page={getPage, setPage}>
  <!-- ... -->
</Pagination.Root>
```

### Pages Snippet

The `pages` snippet prop contains items of type `'page'` (actual page number) or `'ellipsis'` (placeholder between pages). Each item has a `key` property for use in `#each` blocks.

### API Reference

**Pagination.Root**
- `count` (required, number): Total number of items
- `page` ($bindable, number): Selected page
- `onPageChange` (function): Called when page changes
- `perPage` (number, default: 1): Items per page
- `siblingCount` (number, default: 1): Page triggers shown on either side of current page
- `loop` (boolean, default: false): Loop through items when reaching end with keyboard navigation
- `orientation` (enum: 'horizontal' | 'vertical', default: 'horizontal'): Determines keyboard navigation behavior
- `ref` ($bindable, HTMLDivElement): Underlying DOM element
- `children` (Snippet): Receives `{ pages: PageItem[], range: { start, end }, currentPage }`
- `child` (Snippet): Render delegation alternative

**Pagination.Page**
- `page` (PageItem): The page item this component represents
- `ref` ($bindable, HTMLButtonElement): Underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation alternative
- Data attributes: `data-selected` (on current page), `data-pagination-page`

**Pagination.PrevButton**
- `ref` ($bindable, HTMLButtonElement): Underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation alternative
- Data attribute: `data-pagination-prev-button`

**Pagination.NextButton**
- `ref` ($bindable, HTMLButtonElement): Underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): Render delegation alternative
- Data attribute: `data-pagination-next-button`