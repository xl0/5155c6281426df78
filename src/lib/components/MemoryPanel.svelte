<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';

	let { sentMessages }: { sentMessages: string[] } = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Sent Messages</CardTitle>
		<CardDescription>Messages transmitted from this client.</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-3">
			{#if sentMessages.length === 0}
				<p class="text-sm text-muted-foreground">
					Sent messages will appear here after you transmit them.
				</p>
			{:else}
				{#each sentMessages as message, index (`${index}-${message}`)}
					<div class="rounded-xl border bg-muted/20 p-4">
						<Badge variant="outline">Message {index + 1}</Badge>
						<p class="mt-2 text-sm leading-6">{message}</p>
					</div>
				{/each}
			{/if}
		</div>
	</CardContent>
</Card>
