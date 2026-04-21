<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import type { LogEntry } from '$lib/types';

	let { sessionEvents }: { sessionEvents: LogEntry[] } = $props();
	let expandedEntries = $state<Record<string, boolean>>({});
	let showDebug = $state(false);
	const visibleSessionEvents = $derived.by(() =>
		showDebug ? sessionEvents : sessionEvents.filter((event) => event.level !== 'debug')
	);

	function formatTimestamp(timestamp: string) {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	function formatRelativeTimestamp(current: string, previous: string) {
		const diffMs = Math.abs(new Date(current).getTime() - new Date(previous).getTime());

		if (diffMs < 1000) return `+${diffMs}ms`;

		const diffSeconds = diffMs / 1000;
		if (diffSeconds < 60) return `+${diffSeconds.toFixed(diffSeconds < 10 ? 1 : 0)}s`;

		const diffMinutes = Math.floor(diffSeconds / 60);
		const remainingSeconds = Math.round(diffSeconds % 60);
		if (diffMinutes < 60) return `+${diffMinutes}m ${remainingSeconds}s`;

		const diffHours = Math.floor(diffMinutes / 60);
		const remainingMinutes = diffMinutes % 60;
		return `+${diffHours}h ${remainingMinutes}m`;
	}

	// Collapse multiline or irregular whitespace into a compact one-line preview.
	function preview(title: string) {
		return title.replace(/\s+/g, ' ').trim();
	}

	function hasSelection() {
		const selection = window.getSelection();

		return selection !== null && !selection.isCollapsed;
	}

	function toggleEntry(eventId: string) {
		expandedEntries = { ...expandedEntries, [eventId]: !expandedEntries[eventId] };
	}

	function handleGridClick(event: MouseEvent) {
		if (hasSelection()) return;

		const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-log-entry-id]');

		if (!cell || cell.dataset.expandable !== 'true') return;

		toggleEntry(cell.dataset.logEntryId!);
	}

	function clickableLogGrid(node: HTMLElement) {
		node.addEventListener('click', handleGridClick);

		return {
			destroy() {
				node.removeEventListener('click', handleGridClick);
			}
		};
	}
</script>

<Card>
	<CardHeader>
		<div class="flex items-center justify-between gap-3">
			<CardTitle>Session Log</CardTitle>
			<Button variant="outline" size="sm" onclick={() => (showDebug = !showDebug)}>
				{showDebug ? 'Hide Debug' : 'Show Debug'}
			</Button>
		</div>
	</CardHeader>
	<CardContent>
		<div class="-border-t overflow-hidden rounded-xl bg-muted/10">
			{#if visibleSessionEvents.length === 0}
				<p class="p-4 text-sm text-muted-foreground">No events yet.</p>
			{:else}
				<div
					class="grid grid-cols-[auto_auto_auto_minmax(0,1fr)] items-start font-mono text-xs"
					use:clickableLogGrid
				>
					{#each visibleSessionEvents as event, index (event.id)}
						<div class="group contents border border-t">
							<span
								class={`h-full min-w-0 shrink-0 self-start border-t px-4 py-2 text-left text-muted-foreground transition select-text group-hover:bg-muted/40`}
								data-log-entry-id={event.id}
								data-expandable={event.metadata !== undefined}
							>
								{index === 0
									? formatTimestamp(event.timestamp)
									: formatRelativeTimestamp(
											event.timestamp,
											visibleSessionEvents[index - 1].timestamp
										)}
							</span>
							<span
								class={`h-full min-w-0 shrink-0 self-start border-t px-4 py-2 text-left text-muted-foreground transition select-text group-hover:bg-muted/40`}
								data-log-entry-id={event.id}
								data-expandable={event.metadata !== undefined}
							>
								{#if event.metadata !== undefined}
									<ChevronRight
										class={`size-3 transition-transform ${(expandedEntries[event.id] ?? false) ? 'rotate-90' : ''}`}
									/>
								{/if}
							</span>
							<span
								class={`h-full min-w-0 self-start truncate border-t px-4 py-2 text-left uppercase transition select-text group-hover:bg-muted/40 ${
									event.level === 'debug'
										? 'text-muted-foreground/60'
										: event.level === 'error'
											? 'text-fail'
											: event.level === 'success'
												? 'text-ok'
												: event.level === 'warning'
													? 'text-warn'
													: 'text-muted-foreground'
								}`}
								data-log-entry-id={event.id}
								data-expandable={event.metadata !== undefined}>{event.type}</span
							>
							<span
								class={`h-full min-w-0 shrink-0 self-start border-t px-4 py-2 text-left text-muted-foreground transition select-text group-hover:bg-muted/40`}
								data-log-entry-id={event.id}
								data-expandable={event.metadata !== undefined}
							>
								{preview(event.title)}
							</span>
							{#if event.metadata !== undefined && expandedEntries[event.id]}
								<div
									class="col-span-4 overflow-hidden border-t bg-background/70 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
								>
									<pre
										class="overflow-x-auto px-4 py-3 break-words whitespace-pre-wrap text-foreground">{JSON.stringify(
											event.metadata,
											null,
											2
										)}</pre>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</CardContent>
</Card>
