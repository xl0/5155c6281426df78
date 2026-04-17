<script lang="ts">
	import ConnectionPanel from '$lib/components/ConnectionPanel.svelte';
	import DevConsoleHeader from '$lib/components/DevConsoleHeader.svelte';
	import MemoryPanel from '$lib/components/MemoryPanel.svelte';
	import ReferenceDocsDialog from '$lib/components/ReferenceDocsDialog.svelte';
	import SessionLog from '$lib/components/SessionLog.svelte';
	import { NeonDevConsoleState } from '$lib/console-state.svelte.js';
	import { Card } from '$lib/components/ui/card/index.js';

	const state = new NeonDevConsoleState();
</script>

<svelte:head>
	<title>NEON Dev Console</title>
	<meta name="description" content="Development cockpit for the NEON authentication challenge." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
		<Card>
			<DevConsoleHeader
				connectionState={state.connectionState}
				onOpenDocs={() => (state.docsOpen = true)}
			/>
			<ConnectionPanel
				bind:socketUrl={state.socketUrl}
				bind:neonCode={state.neonCode}
				bind:resumeText={state.resumeText}
				connectionState={state.connectionState}
				onConnect={state.connect}
				onDisconnect={state.disconnect}
			/>
		</Card>

		<div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
			<section class="space-y-6">
				<SessionLog sessionEvents={state.sessionEvents} />
			</section>

			<aside class="space-y-6">
				<MemoryPanel spokenMemory={state.spokenMemory} />
			</aside>
		</div>
	</div>

	<ReferenceDocsDialog bind:open={state.docsOpen} bind:docsTab={state.docsTab} />
</div>
