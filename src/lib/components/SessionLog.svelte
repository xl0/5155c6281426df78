<script lang="ts">
	import { Collapsible } from 'bits-ui';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import type { LogEntry } from '$lib/types';

	let { sessionEvents }: { sessionEvents: LogEntry[] } = $props();

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

	const rowClass =
		'grid w-full grid-cols-[7rem_1rem_auto_minmax(0,1fr)] items-center px-4 py-2 text-left transition';
</script>

{#snippet logLine(event: LogEntry, index: number, expandable = false)}
	<span class="shrink-0 text-muted-foreground">
		{index === 0
			? formatTimestamp(event.timestamp)
			: formatRelativeTimestamp(event.timestamp, sessionEvents[index - 1].timestamp)}
	</span>
	<span class="shrink-0 text-muted-foreground">{expandable ? '>' : ''}</span>
	<span
		class={`min-w-0 truncate pr-3 uppercase ${
			event.level === 'error'
				? 'text-fail'
				: event.level === 'success'
					? 'text-ok'
					: event.level === 'warning'
						? 'text-warn'
						: 'text-muted-foreground'
		}`}>{event.type}</span
	>
	<span class="min-w-0 text-foreground">{preview(event.title)}</span>
{/snippet}

<Card>
	<CardHeader>
		<CardTitle>Session Log</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="overflow-hidden rounded-xl border bg-muted/10 font-mono text-xs">
			{#if sessionEvents.length === 0}
				<p class="p-4 text-sm text-muted-foreground">No events yet.</p>
			{:else}
				{#each sessionEvents as event, index (event.id)}
					{#if event.metadata !== undefined}
						<Collapsible.Root class="border-t first:border-t-0">
							<Collapsible.Trigger class={`${rowClass} items-start hover:bg-muted/40`}>
								{@render logLine(event, index, true)}
							</Collapsible.Trigger>
							<Collapsible.Content
								class="overflow-hidden border-t bg-background/70 px-4 py-3 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
							>
								<div class="pl-[20rem]">
									<pre
										class="mt-2 overflow-x-auto break-words whitespace-pre-wrap text-foreground">{JSON.stringify(
											event.metadata,
											null,
											2
										)}</pre>
								</div>
							</Collapsible.Content>
						</Collapsible.Root>
					{:else}
						<div class={`${rowClass} border-t first:border-t-0`}>
							{@render logLine(event, index)}
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</CardContent>
</Card>
