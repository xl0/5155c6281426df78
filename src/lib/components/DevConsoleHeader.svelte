<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { toggleMode } from 'mode-watcher';

	let {
		connectionState,
		onOpenDocs
	}: {
		connectionState: 'disconnected' | 'connecting' | 'connected';
		onOpenDocs: () => void;
	} = $props();
</script>

<CardHeader>
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<p class="text-sm tracking-[0.3em] text-muted-foreground uppercase">NEON Dev Console</p>
			<CardTitle class="mt-2 text-3xl">Authentication cockpit</CardTitle>
			<CardDescription class="mt-3 max-w-3xl text-sm leading-6">
				Connect to the challenge socket, reconstruct fragmented prompts, draft compliant responses,
				and keep your session history intact for final verification.
			</CardDescription>
		</div>
		<div class="flex flex-wrap items-center justify-end gap-3">
			<Button variant="outline" size="icon" class="relative" onclick={toggleMode}>
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			<Button variant="outline" onclick={onOpenDocs}>Reference docs</Button>
			<Badge variant="secondary">{connectionState}</Badge>
		</div>
	</div>
</CardHeader>
