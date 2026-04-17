<script lang="ts">
	import { onDestroy } from 'svelte';

	import { consoleActions } from '$lib/console-actions.js';
	import ConnectionPanel from '$lib/components/ConnectionPanel.svelte';
	import MemoryPanel from '$lib/components/MemoryPanel.svelte';
	import ReferenceDocsDialog from '$lib/components/ReferenceDocsDialog.svelte';
	import SessionLog from '$lib/components/SessionLog.svelte';
	import { transmissionState, uiState } from '$lib/state/index';

	onDestroy(consoleActions.disconnect);
</script>

<svelte:head>
	<title>NEON Dev Console</title>
	<meta name="description" content="Development cockpit for the NEON authentication challenge." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
		<ConnectionPanel />

		<div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
			<section class="space-y-6">
				<SessionLog sessionEvents={transmissionState.sessionEvents} />
			</section>

			<aside class="space-y-6">
				<MemoryPanel spokenMemory={transmissionState.spokenMemory} />
			</aside>
		</div>
	</div>

	<ReferenceDocsDialog bind:open={uiState.docsOpen} bind:docsTab={uiState.docsTab} />
</div>
