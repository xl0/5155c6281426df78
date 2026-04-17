<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { CardContent } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let {
		socketUrl = $bindable(),
		neonCode = $bindable(),
		resumeText = $bindable(),
		connectionState,
		onConnect,
		onDisconnect
	}: {
		socketUrl: string;
		neonCode: string;
		resumeText: string;
		connectionState: 'disconnected' | 'connecting' | 'connected';
		onConnect: () => void;
		onDisconnect: () => void;
	} = $props();
</script>

<CardContent class="grid gap-4 lg:grid-cols-2">
	<label class="space-y-2">
		<span class="text-sm font-medium">WebSocket URL</span>
		<Input bind:value={socketUrl} />
	</label>

	<label class="space-y-2">
		<span class="text-sm font-medium">Neon Code</span>
		<Input bind:value={neonCode} placeholder="Enter vessel authorization code" />
	</label>

	<label class="space-y-2 lg:col-span-2">
		<span class="text-sm font-medium">Crew Manifest / Resume</span>
		<Textarea
			bind:value={resumeText}
			rows={7}
			placeholder="Paste the resume or crew manifest here for manual crew-transmission answers."
		/>
	</label>

	<div class="flex flex-wrap items-center gap-3 lg:col-span-2">
		<Button onclick={onConnect}>{connectionState === 'connected' ? 'Reconnect' : 'Connect'}</Button>
		<Button variant="outline" onclick={onDisconnect}>Disconnect</Button>
		<Badge variant="outline">Status: {connectionState}</Badge>
	</div>
</CardContent>
