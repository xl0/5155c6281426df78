<script lang="ts">
	import missionDoc from '../../../docs/misson.md?raw';
	import protocolDoc from '../../../docs/protocol.txt?raw';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { Collapsible } from 'bits-ui';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { toggleMode } from 'mode-watcher';

	type Fragment = {
		word: string;
		timestamp: number;
	};

	type EnterDigitsPayload = {
		type: 'enter_digits';
		digits: string;
	};

	type SpeakTextPayload = {
		type: 'speak_text';
		text: string;
	};

	type OutgoingPayload = EnterDigitsPayload | SpeakTextPayload;

	type SessionEvent = {
		id: number;
		kind: 'status' | 'incoming' | 'outgoing' | 'error' | 'success';
		label: string;
		detail: string;
		fragments?: Fragment[];
	};

	type ParsedChallenge = {
		mode: OutgoingPayload['type'] | null;
		label: string;
		notes: string[];
		draft: string;
		auto: boolean;
	};

	type SpokenMemory = {
		prompt: string;
		text: string;
	};

	const defaultSocketUrl = 'wss://neonhealth.software/agent-puzzle/challenge';
	const ordinalWords = [
		'first',
		'second',
		'third',
		'fourth',
		'fifth',
		'sixth',
		'seventh',
		'eighth'
	];

	let socketUrl = $state(defaultSocketUrl);
	let neonCode = $state('');
	let resumeText = $state('');
	let manualMode = $state<OutgoingPayload['type']>('speak_text');
	let manualValue = $state('');
	let currentPrompt = $state('');
	let currentFragments = $state<Fragment[]>([]);
	let currentAdvice = $state<ParsedChallenge>({
		mode: null,
		label: 'Waiting for a transmission',
		notes: ['Connect to NEON to receive fragmented challenges.'],
		draft: '',
		auto: false
	});
	let docsTab = $state<'mission' | 'protocol'>('mission');
	let docsOpen = $state(false);
	let sessionEvents = $state<SessionEvent[]>([]);
	let spokenMemory = $state<SpokenMemory[]>([]);
	let connectionState = $state<'disconnected' | 'connecting' | 'connected'>('disconnected');
	let websocket: WebSocket | null = null;

	const characterConstraint = $derived(parseCharacterConstraint(currentPrompt));
	const manualLength = $derived(manualValue.length);

	function logEvent(
		kind: SessionEvent['kind'],
		label: string,
		detail: string,
		fragments?: Fragment[]
	) {
		sessionEvents = [
			{ id: Date.now() + Math.random(), kind, label, detail, fragments },
			...sessionEvents
		].slice(0, 40);
	}

	function reconstructMessage(fragments: Fragment[]) {
		return [...fragments]
			.sort((left, right) => left.timestamp - right.timestamp)
			.map((fragment) => fragment.word)
			.join(' ')
			.trim();
	}

	function parseCharacterConstraint(prompt: string) {
		const exact = prompt.match(/exactly\s+(\d+)\s+characters/i);
		if (exact) {
			return { kind: 'exact' as const, min: Number(exact[1]), max: Number(exact[1]) };
		}

		const range = prompt.match(/between\s+(\d+)\s+and\s+(\d+)\s+characters/i);
		if (range) {
			return { kind: 'range' as const, min: Number(range[1]), max: Number(range[2]) };
		}

		const max = prompt.match(/max\s+(\d+)\s+characters/i);
		if (max) {
			return { kind: 'max' as const, min: 0, max: Number(max[1]) };
		}

		return null;
	}

	function wordsFromText(text: string) {
		return text.split(/\s+/).filter(Boolean);
	}

	function ordinalToIndex(raw: string) {
		const numeric = raw.match(/(\d+)/);
		if (numeric) return Number(numeric[1]) - 1;

		const spelled = ordinalWords.indexOf(raw.toLowerCase());
		return spelled >= 0 ? spelled : -1;
	}

	function extractMathExpression(prompt: string) {
		const patterns = [
			/calculate\s+(.+?)(?:\s+and\s+(?:transmit|enter|respond)|[.?!]|$)/i,
			/what(?:'s| is)\s+(.+?)(?:[?]|\s+and\s+(?:transmit|enter|respond)|$)/i,
			/expression\s+(.+?)(?:[.?!]|$)/i
		];

		for (const pattern of patterns) {
			const match = prompt.match(pattern);
			if (!match) continue;

			const expression = match[1]
				.trim()
				.replace(/followed by the pound key.*/i, '')
				.trim();
			if (expression) return expression;
		}

		return '';
	}

	function safelyEvaluateExpression(expression: string) {
		if (!/^[\d\s+\-*/%().,Mathfloor]+$/.test(expression.replace(/Math\.floor/g, 'Mathfloor'))) {
			throw new Error('Unsupported expression format');
		}

		const result = Function(`"use strict"; return (${expression});`)();
		if (!Number.isFinite(result)) {
			throw new Error('Expression did not produce a finite number');
		}

		return String(Math.trunc(result));
	}

	async function getKnowledgeArchiveWord(prompt: string) {
		const match = prompt.match(
			/(?:speak|transmit)\s+the\s+(.+?)\s+word\s+in\s+the\s+knowledge archive entry for\s+(.+?)(?:[.?!]|$)/i
		);
		if (!match) {
			throw new Error('Could not parse the knowledge archive request');
		}

		const index = ordinalToIndex(match[1]);
		if (index < 0) {
			throw new Error('Unsupported word index');
		}

		const title = match[2].trim();
		const response = await fetch(
			`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
		);
		if (!response.ok) {
			throw new Error(`Wikipedia request failed with ${response.status}`);
		}

		const data = (await response.json()) as { extract?: string };
		const words = wordsFromText(data.extract ?? '');
		const word = words[index];
		if (!word) {
			throw new Error('Requested word is outside the article summary');
		}

		return word.replace(/^['"“”‘’()\[\]{}]+|['"“”‘’()\[\]{}.,!?;:]+$/g, '');
	}

	function getVerificationWord(prompt: string) {
		if (!spokenMemory.length) {
			throw new Error('No earlier spoken transmissions recorded yet');
		}

		const ordinalMatch = prompt.match(/(?:the\s+)?(.+?)\s+word/i);
		const wordIndex = ordinalMatch ? ordinalToIndex(ordinalMatch[1]) : -1;
		if (wordIndex < 0) {
			throw new Error('Could not parse the verification word position');
		}

		let memoryIndex = spokenMemory.length - 1;
		if (/first transmission/i.test(prompt)) memoryIndex = 0;
		if (/second transmission/i.test(prompt)) memoryIndex = 1;
		if (/third transmission/i.test(prompt)) memoryIndex = 2;
		if (/last transmission|previous transmission/i.test(prompt))
			memoryIndex = spokenMemory.length - 1;

		const referencedPrompt = prompt.match(/about\s+(.+?)(?:[.?!]|$)/i)?.[1]?.toLowerCase();
		if (referencedPrompt) {
			const foundIndex = spokenMemory.findIndex((memory) =>
				memory.prompt.toLowerCase().includes(referencedPrompt)
			);
			if (foundIndex >= 0) {
				memoryIndex = foundIndex;
			}
		}

		const memory = spokenMemory[memoryIndex];
		if (!memory) {
			throw new Error('Referenced spoken transmission is not available');
		}

		const word = wordsFromText(memory.text)[wordIndex];
		if (!word) {
			throw new Error('Requested word is outside the saved transmission');
		}

		return word.replace(/^['"“”‘’()\[\]{}]+|['"“”‘’()\[\]{}.,!?;:]+$/g, '');
	}

	async function buildAdvice(prompt: string): Promise<ParsedChallenge> {
		const lowerPrompt = prompt.toLowerCase();

		if (/knowledge archive entry/i.test(prompt)) {
			const word = await getKnowledgeArchiveWord(prompt);
			return {
				mode: 'speak_text',
				label: 'Knowledge Archive Query',
				notes: ['Fetched the Wikipedia summary and extracted the requested word.'],
				draft: word,
				auto: true
			};
		}

		if (
			/earlier crew manifest|earlier response|last transmission|previous transmission/i.test(
				lowerPrompt
			)
		) {
			const word = getVerificationWord(prompt);
			return {
				mode: 'speak_text',
				label: 'Transmission Verification',
				notes: ['Using saved spoken responses from this session.'],
				draft: word,
				auto: true
			};
		}

		if (/calculate|math\.floor|plus|minus|\*|\/|%|\(/i.test(prompt)) {
			const expression = extractMathExpression(prompt);
			if (!expression) {
				throw new Error('Could not isolate the arithmetic expression');
			}

			const value = safelyEvaluateExpression(expression);
			const suffix = /pound key/i.test(prompt) ? '#' : '';
			return {
				mode: 'enter_digits',
				label: 'Computational Assessment',
				notes: [`Evaluated: ${expression}`],
				draft: `${value}${suffix}`,
				auto: true
			};
		}

		if (/authorization code|neon code|vessel/i.test(lowerPrompt)) {
			return {
				mode: 'enter_digits',
				label: 'Vessel Identification',
				notes: neonCode
					? ['Using the Neon Code from the briefing form.']
					: ['Enter the Neon Code above, then send it.'],
				draft: neonCode,
				auto: Boolean(neonCode)
			};
		}

		const frequencyMatch = prompt.match(/(?:respond on|enter|press)\s+(?:frequency\s+)?([\d#]+)/i);
		if (frequencyMatch) {
			return {
				mode: 'enter_digits',
				label: 'Signal Handshake',
				notes: ['Prompt includes a keypad value directly.'],
				draft: frequencyMatch[1],
				auto: true
			};
		}

		if (
			/crew|resume|background|education|experience|skills|project|deployment/i.test(lowerPrompt)
		) {
			const notes = [
				'Answer from the resume field and keep the response within any stated character limit.'
			];
			if (characterConstraint) {
				notes.push(
					`Current constraint: ${characterConstraint.min}-${characterConstraint.max} characters.`
				);
			}

			return {
				mode: 'speak_text',
				label: 'Crew Manifest Transmission',
				notes,
				draft: '',
				auto: false
			};
		}

		return {
			mode: null,
			label: 'Manual Review Needed',
			notes: [
				'The prompt did not match a known checkpoint pattern. Review the protocol and respond manually.'
			],
			draft: '',
			auto: false
		};
	}

	function connect() {
		if (websocket) websocket.close();

		connectionState = 'connecting';
		currentPrompt = '';
		currentFragments = [];
		currentAdvice = {
			mode: null,
			label: 'Waiting for a transmission',
			notes: ['Connection opened. Waiting for NEON to speak.'],
			draft: '',
			auto: false
		};
		spokenMemory = [];

		websocket = new WebSocket(socketUrl);

		websocket.onopen = () => {
			connectionState = 'connected';
			logEvent('status', 'Connected', socketUrl);
		};

		websocket.onclose = () => {
			connectionState = 'disconnected';
			logEvent('status', 'Disconnected', 'Socket closed');
			websocket = null;
		};

		websocket.onerror = () => {
			logEvent('error', 'Socket Error', 'The websocket reported an error.');
		};

		websocket.onmessage = async (event) => {
			try {
				const payload = JSON.parse(String(event.data)) as
					| { type: 'challenge'; message: Fragment[] }
					| { type: 'success' }
					| { type: 'error'; message: string };

				if (payload.type === 'success') {
					logEvent('success', 'Access Granted', 'Authentication complete.');
					return;
				}

				if (payload.type === 'error') {
					logEvent('error', 'Rejected', payload.message);
					return;
				}

				currentFragments = payload.message;
				currentPrompt = reconstructMessage(payload.message);
				logEvent('incoming', 'Challenge', currentPrompt, payload.message);

				try {
					currentAdvice = await buildAdvice(currentPrompt);
					if (currentAdvice.mode) {
						manualMode = currentAdvice.mode;
					}
					manualValue = currentAdvice.draft;
				} catch (error) {
					currentAdvice = {
						mode: null,
						label: 'Manual Review Needed',
						notes: [error instanceof Error ? error.message : 'Could not prepare a draft response.'],
						draft: '',
						auto: false
					};
					manualValue = '';
				}
			} catch (error) {
				logEvent(
					'error',
					'Parse Error',
					error instanceof Error ? error.message : 'Unknown message error'
				);
			}
		};
	}

	function disconnect() {
		websocket?.close();
	}

	function sendManualResponse() {
		if (!websocket || websocket.readyState !== WebSocket.OPEN) {
			logEvent('error', 'Send Failed', 'Connect to NEON before transmitting.');
			return;
		}

		if (!manualValue.trim()) {
			logEvent('error', 'Send Failed', 'Response payload is empty.');
			return;
		}

		if (manualMode === 'speak_text' && manualValue.length > 256) {
			logEvent(
				'error',
				'Send Failed',
				'speak_text responses must stay at or under 256 characters.'
			);
			return;
		}

		if (characterConstraint) {
			if (
				manualValue.length < characterConstraint.min ||
				manualValue.length > characterConstraint.max
			) {
				logEvent(
					'error',
					'Send Failed',
					`Response must stay between ${characterConstraint.min} and ${characterConstraint.max} characters.`
				);
				return;
			}
		}

		const payload: OutgoingPayload =
			manualMode === 'enter_digits'
				? { type: 'enter_digits', digits: manualValue }
				: { type: 'speak_text', text: manualValue };

		websocket.send(JSON.stringify(payload));
		logEvent('outgoing', 'Transmitted', JSON.stringify(payload));

		if (payload.type === 'speak_text') {
			spokenMemory = [...spokenMemory, { prompt: currentPrompt, text: payload.text }].slice(-12);
		}
	}
</script>

<svelte:head>
	<title>NEON Dev Console</title>
	<meta name="description" content="Development cockpit for the NEON authentication challenge." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
		<Card>
			<CardHeader>
				<div class="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p class="text-sm tracking-[0.3em] text-muted-foreground uppercase">NEON Dev Console</p>
						<CardTitle class="mt-2 text-3xl">Authentication cockpit</CardTitle>
						<CardDescription class="mt-3 max-w-3xl text-sm leading-6">
							Connect to the challenge socket, reconstruct fragmented prompts, draft compliant
							responses, and keep your session history intact for final verification.
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
						<Button variant="outline" onclick={() => (docsOpen = true)}>Reference docs</Button>
						<Badge variant="secondary">{connectionState}</Badge>
					</div>
				</div>
			</CardHeader>
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
					<Button onclick={connect}
						>{connectionState === 'connected' ? 'Reconnect' : 'Connect'}</Button
					>
					<Button variant="outline" onclick={disconnect}>Disconnect</Button>
					<Badge variant="outline">Status: {connectionState}</Badge>
				</div>
			</CardContent>
		</Card>

		<div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
			<section class="space-y-6">
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
							<Badge variant="secondary">Draft ready: {currentAdvice.auto ? 'yes' : 'manual'}</Badge
							>
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

						<Button onclick={sendManualResponse} class="mt-4 w-full">Send JSON payload</Button>

						{#if resumeText}
							<Separator class="my-4" />
							<div>
								<p class="text-sm font-medium">Crew reference</p>
								<ScrollArea class="mt-2 h-40 rounded-xl border bg-muted/20 p-4">
									<p class="text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
										{resumeText}
									</p>
								</ScrollArea>
							</div>
						{/if}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Session Log</CardTitle>
						<CardDescription>Incoming prompts, outgoing payloads, and socket state.</CardDescription
						>
					</CardHeader>
					<CardContent>
						<div class="space-y-3">
							{#if sessionEvents.length === 0}
								<p class="text-sm text-muted-foreground">No events yet.</p>
							{:else}
								{#each sessionEvents as event (event.id)}
									{#if event.kind === 'incoming' && event.fragments}
										<Collapsible.Root class="rounded-xl border bg-muted/20 p-4">
											<div class="flex items-start justify-between gap-3">
												<div>
													<div class="flex items-center gap-3">
														<p class="text-sm font-medium">{event.label}</p>
														<Badge variant="outline">{event.kind}</Badge>
													</div>
													<p
														class="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground"
													>
														{event.detail}
													</p>
												</div>
												<Collapsible.Trigger
													class="inline-flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
												>
													<ChevronDownIcon
														class="size-4 transition-transform data-[state=open]:rotate-180"
													/>
													<span class="sr-only">Toggle raw fragments</span>
												</Collapsible.Trigger>
											</div>
											<Collapsible.Content
												hiddenUntilFound
												class="mt-3 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
											>
												<div class="space-y-2 border-t pt-3">
													<p
														class="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase"
													>
														Raw fragments
													</p>
													<div class="flex flex-wrap gap-2 text-xs">
														{#each [...event.fragments].sort((a, b) => a.timestamp - b.timestamp) as fragment}
															<Badge variant="secondary"
																>{fragment.timestamp}: {fragment.word}</Badge
															>
														{/each}
													</div>
												</div>
											</Collapsible.Content>
										</Collapsible.Root>
									{:else}
										<div class="rounded-xl border bg-muted/20 p-4">
											<div class="flex items-center justify-between gap-3">
												<p class="text-sm font-medium">{event.label}</p>
												<Badge variant="outline">{event.kind}</Badge>
											</div>
											<p class="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
												{event.detail}
											</p>
										</div>
									{/if}
								{/each}
							{/if}
						</div>
					</CardContent>
				</Card>
			</section>

			<aside class="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Memory</CardTitle>
						<CardDescription
							>Spoken transmissions saved for the final verification step.</CardDescription
						>
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
										<p class="mt-2 text-xs leading-5 text-muted-foreground">
											Prompt: {memory.prompt}
										</p>
									</div>
								{/each}
							{/if}
						</div>
					</CardContent>
				</Card>
			</aside>
		</div>
	</div>

	<Dialog bind:open={docsOpen}>
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
</div>
