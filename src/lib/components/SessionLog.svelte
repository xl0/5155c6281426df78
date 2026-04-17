<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { Collapsible } from 'bits-ui';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import type { SessionEvent } from '$lib/types';

	let { sessionEvents }: { sessionEvents: SessionEvent[] } = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Session Log</CardTitle>
		<CardDescription>Incoming prompts, outgoing payloads, and socket state.</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-3">
			{#if sessionEvents.length === 0}
				<p class="text-sm text-muted-foreground">No events yet.</p>
			{:else}
				{#each sessionEvents as event (event.id)}
					{#if event.kind === 'incoming' && event.fragments}
						<Collapsible.Root class="rounded-xl border bg-muted/20 p-4">
							<div class="flex items-start justify-between gap-3">
								<div>
									<div class="flex items-center gap-3">
										<p class="text-sm font-medium">{event.label}</p>
										<Badge variant="outline">{event.kind}</Badge>
									</div>
									<p class="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
										{event.detail}
									</p>
								</div>
								<Collapsible.Trigger
									class="inline-flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
								>
									<ChevronDownIcon
										class="size-4 transition-transform data-[state=open]:rotate-180"
									/>
									<span class="sr-only">Toggle raw fragments</span>
								</Collapsible.Trigger>
							</div>
							<Collapsible.Content
								hiddenUntilFound
								class="mt-3 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
							>
								<div class="space-y-2 border-t pt-3">
									<p class="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
										Raw fragments
									</p>
									<div class="flex flex-wrap gap-2 text-xs">
										{#each [...event.fragments].sort((a, b) => a.timestamp - b.timestamp) as fragment}
											<Badge variant="secondary">{fragment.timestamp}: {fragment.word}</Badge>
										{/each}
									</div>
								</div>
							</Collapsible.Content>
						</Collapsible.Root>
					{:else}
						<div class="rounded-xl border bg-muted/20 p-4">
							<div class="flex items-center justify-between gap-3">
								<p class="text-sm font-medium">{event.label}</p>
								<Badge variant="outline">{event.kind}</Badge>
							</div>
							<p class="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
								{event.detail}
							</p>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</CardContent>
</Card>
