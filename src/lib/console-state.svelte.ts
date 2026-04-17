import { onDestroy } from 'svelte';

import {
	buildAdvice,
	connectedAdvice,
	defaultAdvice,
	parseCharacterConstraint,
	reconstructMessage
} from '$lib/protocol';
import type {
	Fragment,
	OutgoingPayload,
	ParsedChallenge,
	SessionEvent,
	SpokenMemory
} from '$lib/types';

const defaultSocketUrl = 'wss://neonhealth.software/agent-puzzle/challenge';

type IncomingPayload =
	| { type: 'challenge'; message: Fragment[] }
	| { type: 'success' }
	| { type: 'error'; message: string };

export class NeonDevConsoleState {
	socketUrl = $state(defaultSocketUrl);
	neonCode = $state('');
	resumeText = $state('');
	manualMode = $state<OutgoingPayload['type']>('speak_text');
	manualValue = $state('');
	currentPrompt = $state('');
	currentFragments = $state<Fragment[]>([]);
	currentAdvice = $state<ParsedChallenge>(defaultAdvice);
	docsTab = $state<'mission' | 'protocol'>('mission');
	docsOpen = $state(false);
	sessionEvents = $state<SessionEvent[]>([]);
	spokenMemory = $state<SpokenMemory[]>([]);
	connectionState = $state<'disconnected' | 'connecting' | 'connected'>('disconnected');
	private websocket: WebSocket | null = null;

	constructor() {
		onDestroy(() => {
			this.disconnect();
		});
	}

	get characterConstraint() {
		return parseCharacterConstraint(this.currentPrompt);
	}

	get manualLength() {
		return this.manualValue.length;
	}

	logEvent = (
		kind: SessionEvent['kind'],
		label: string,
		detail: string,
		fragments?: Fragment[]
	) => {
		this.sessionEvents = [
			{ id: Date.now() + Math.random(), kind, label, detail, fragments },
			...this.sessionEvents
		].slice(0, 40);
	};

	connect = () => {
		if (this.websocket) this.websocket.close();

		this.connectionState = 'connecting';
		this.currentPrompt = '';
		this.currentFragments = [];
		this.currentAdvice = connectedAdvice;
		this.spokenMemory = [];

		this.websocket = new WebSocket(this.socketUrl);

		this.websocket.onopen = () => {
			this.connectionState = 'connected';
			this.logEvent('status', 'Connected', this.socketUrl);
		};

		this.websocket.onclose = () => {
			this.connectionState = 'disconnected';
			this.logEvent('status', 'Disconnected', 'Socket closed');
			this.websocket = null;
		};

		this.websocket.onerror = () => {
			this.logEvent('error', 'Socket Error', 'The websocket reported an error.');
		};

		this.websocket.onmessage = async (event) => {
			await this.handleMessage(event);
		};
	};

	disconnect = () => {
		this.websocket?.close();
	};

	sendManualResponse = () => {
		if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
			this.logEvent('error', 'Send Failed', 'Connect to NEON before transmitting.');
			return;
		}

		if (!this.manualValue.trim()) {
			this.logEvent('error', 'Send Failed', 'Response payload is empty.');
			return;
		}

		if (this.manualMode === 'speak_text' && this.manualValue.length > 256) {
			this.logEvent(
				'error',
				'Send Failed',
				'speak_text responses must stay at or under 256 characters.'
			);
			return;
		}

		const { characterConstraint } = this;
		if (characterConstraint) {
			if (
				this.manualValue.length < characterConstraint.min ||
				this.manualValue.length > characterConstraint.max
			) {
				this.logEvent(
					'error',
					'Send Failed',
					`Response must stay between ${characterConstraint.min} and ${characterConstraint.max} characters.`
				);
				return;
			}
		}

		const payload: OutgoingPayload =
			this.manualMode === 'enter_digits'
				? { type: 'enter_digits', digits: this.manualValue }
				: { type: 'speak_text', text: this.manualValue };

		this.websocket.send(JSON.stringify(payload));
		this.logEvent('outgoing', 'Transmitted', JSON.stringify(payload));

		if (payload.type === 'speak_text') {
			this.spokenMemory = [
				...this.spokenMemory,
				{ prompt: this.currentPrompt, text: payload.text }
			].slice(-12);
		}
	};

	private async handleMessage(event: MessageEvent) {
		try {
			const payload = JSON.parse(String(event.data)) as IncomingPayload;

			if (payload.type === 'success') {
				this.logEvent('success', 'Access Granted', 'Authentication complete.');
				return;
			}

			if (payload.type === 'error') {
				this.logEvent('error', 'Rejected', payload.message);
				return;
			}

			this.currentFragments = payload.message;
			this.currentPrompt = reconstructMessage(payload.message);
			this.logEvent('incoming', 'Challenge', this.currentPrompt, payload.message);

			try {
				this.currentAdvice = await buildAdvice({
					prompt: this.currentPrompt,
					neonCode: this.neonCode,
					spokenMemory: this.spokenMemory,
					characterConstraint: this.characterConstraint
				});
				if (this.currentAdvice.mode) {
					this.manualMode = this.currentAdvice.mode;
				}
				this.manualValue = this.currentAdvice.draft;
			} catch (error) {
				this.currentAdvice = {
					mode: null,
					label: 'Manual Review Needed',
					notes: [error instanceof Error ? error.message : 'Could not prepare a draft response.'],
					draft: '',
					auto: false
				};
				this.manualValue = '';
			}
		} catch (error) {
			this.logEvent(
				'error',
				'Parse Error',
				error instanceof Error ? error.message : 'Unknown message error'
			);
		}
	}
}
