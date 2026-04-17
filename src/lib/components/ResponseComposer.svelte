<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Tabs, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type { CharacterConstraint, OutgoingPayload, ParsedChallenge } from '$lib/types';

	let {
		manualMode = $bindable(),
		manualValue = $bindable(),
		currentAdvice,
		characterConstraint,
		manualLength,
		resumeText,
		onSend
	}: {
		manualMode: OutgoingPayload['type'];
		manualValue: string;
		currentAdvice: ParsedChallenge;
		characterConstraint: CharacterConstraint | null;
		manualLength: number;
		resumeText: string;
		onSend: () => void;
	} = $props();
</script>

<Card>
	<CardHeader>
		<Badge variant="outline" class="w-fit">Transmit Response</Badge>
	</CardHeader>
	<CardContent>
		<Tabs bind:value={manualMode} class="gap-4">
			<TabsList class="grid w-full grid-cols-2">
				<TabsTrigger value="enter_digits">enter_digits</TabsTrigger>
				<TabsTrigger value="speak_text">speak_text</TabsTrigger>
			</TabsList>
		</Tabs>

		<Textarea
			bind:value={manualValue}
			rows={8}
			placeholder={manualMode === 'enter_digits'
				? 'Digits to enter on the keypad'
				: 'Text to speak to NEON'}
			class="mt-4"
		/>

		<div class="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
			<Badge variant="secondary">Draft ready: {currentAdvice.auto ? 'yes' : 'manual'}</Badge>
			<Badge variant="secondary">Length: {manualLength}</Badge>
			{#if characterConstraint}
				<Badge variant="secondary"
					>Allowed: {characterConstraint.min}-{characterConstraint.max}</Badge
				>
			{/if}
			{#if manualMode === 'speak_text'}
				<Badge variant="secondary">Absolute max: 256</Badge>
			{/if}
		</div>

		<Button onclick={onSend} class="mt-4 w-full">Send JSON payload</Button>

		{#if resumeText}
			<Separator class="my-4" />
			<div>
				<p class="text-sm font-medium">Crew reference</p>
				<ScrollArea class="mt-2 h-40 rounded-xl border bg-muted/20 p-4">
					<p class="text-xs leading-5 whitespace-pre-wrap text-muted-foreground">{resumeText}</p>
				</ScrollArea>
			</div>
		{/if}
	</CardContent>
</Card>
