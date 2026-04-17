<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import type { SpokenMemory } from '$lib/types';

	let { spokenMemory }: { spokenMemory: SpokenMemory[] } = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Memory</CardTitle>
		<CardDescription>Spoken transmissions saved for the final verification step.</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-3">
			{#if spokenMemory.length === 0}
				<p class="text-sm text-muted-foreground">
					Spoken responses will appear here after you transmit them.
				</p>
			{:else}
				{#each spokenMemory as memory, index}
					<div class="rounded-xl border bg-muted/20 p-4">
						<Badge variant="outline">Transmission {index + 1}</Badge>
						<p class="mt-2 text-sm leading-6">{memory.text}</p>
						<p class="mt-2 text-xs leading-5 text-muted-foreground">Prompt: {memory.prompt}</p>
					</div>
				{/each}
			{/if}
		</div>
	</CardContent>
</Card>
