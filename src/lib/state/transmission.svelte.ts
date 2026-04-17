import type { Fragment, SessionEvent, SpokenMemory } from '$lib/types';

class TransmissionState {
	currentPrompt = $state('');
	currentFragments = $state<Fragment[]>([]);
	sessionEvents = $state<SessionEvent[]>([]);
	spokenMemory = $state<SpokenMemory[]>([]);
	connectionState = $state<'disconnected' | 'connecting' | 'connected'>('disconnected');
	private websocket: WebSocket | null = null;

	get socket() {
		return this.websocket;
	}

	setSocket(socket: WebSocket) {
		this.websocket = socket;
	}

	clearSocket() {
		this.websocket = null;
	}

	disconnect() {
		this.websocket?.close();
	}

	resetForConnection() {
		this.connectionState = 'connecting';
		this.currentPrompt = '';
		this.currentFragments = [];
		this.spokenMemory = [];
	}

	setConnected() {
		this.connectionState = 'connected';
	}

	setDisconnected() {
		this.connectionState = 'disconnected';
	}

	setChallenge(prompt: string, fragments: Fragment[]) {
		this.currentPrompt = prompt;
		this.currentFragments = fragments;
	}

	rememberSpokenTransmission(text: string) {
		this.spokenMemory = [...this.spokenMemory, { prompt: this.currentPrompt, text }].slice(-12);
	}

	logEvent(kind: SessionEvent['kind'], label: string, detail: string, fragments?: Fragment[]) {
		this.sessionEvents = [
			{ id: Date.now() + Math.random(), kind, label, detail, fragments },
			...this.sessionEvents
		].slice(0, 40);
	}
}

export const transmissionState = new TransmissionState();
