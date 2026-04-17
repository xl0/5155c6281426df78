<script lang="ts">
	import missionDoc from '../../../docs/misson.md?raw';
	import protocolDoc from '../../../docs/protocol.txt?raw';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';

	let {
		open = $bindable(false),
		docsTab = $bindable('mission')
	}: {
		open: boolean;
		docsTab: 'mission' | 'protocol';
	} = $props();
</script>

<Dialog bind:open>
	<DialogContent class="h-[90vh] max-w-[min(96vw,1400px)]">
		<DialogHeader>
			<DialogTitle>Reference Docs</DialogTitle>
			<DialogDescription>Mission briefing and protocol, hidden until needed.</DialogDescription>
		</DialogHeader>

		<Tabs bind:value={docsTab} class="gap-4">
			<TabsList class="grid w-full grid-cols-2">
				<TabsTrigger value="mission">Mission</TabsTrigger>
				<TabsTrigger value="protocol">Protocol</TabsTrigger>
			</TabsList>
			<TabsContent value="mission">
				<ScrollArea class="h-[70vh] rounded-xl border bg-muted/20 p-4">
					<pre
						class="text-xs leading-6 whitespace-pre-wrap text-muted-foreground">{missionDoc}</pre>
				</ScrollArea>
			</TabsContent>
			<TabsContent value="protocol">
				<ScrollArea class="h-[70vh] rounded-xl border bg-muted/20 p-4">
					<pre
						class="text-xs leading-6 whitespace-pre-wrap text-muted-foreground">{protocolDoc}</pre>
				</ScrollArea>
			</TabsContent>
		</Tabs>
	</DialogContent>
</Dialog>
