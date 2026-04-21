import { loggerState } from '$lib/state/logger.svelte';
import type { ReceivedMessage } from '$lib/types';

class TransmissionState {
	connectionState = $state<'disconnected' | 'connecting' | 'connected'>('disconnected');
	private websocket: WebSocket | null = null;
	private incomingHandler: ((message: ReceivedMessage) => Promise<void> | void) | null = null;

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
	}

	setConnected() {
		this.connectionState = 'connected';
	}

	setDisconnected() {
		this.connectionState = 'disconnected';
	}

	setIncomingHandler(handler: ((message: ReceivedMessage) => Promise<void> | void) | null) {
		this.incomingHandler = handler;
	}

	async handleIncomingMessage(text: string, fragments: ReceivedMessage['fragments']) {
		const message = { id: Date.now() + Math.random(), text, fragments };
		loggerState.log('transmission:in', text, { fragments });

		if (!this.incomingHandler) {
			loggerState.log(
				'transmission:unhandled',
				'No incoming handler registered.',
				{
					message
				},
				'warning'
			);
			return;
		}

		await this.incomingHandler(message);
	}

	sendDigits(digits: string) {
		if (!this.websocket || this.connectionState !== 'connected') {
			throw new Error('Cannot transmit without an active websocket connection.');
		}

		const payload = { type: 'enter_digits', digits } as const;
		this.websocket.send(JSON.stringify(payload));
		loggerState.log('transmission:out:digits', `Sent digits: ${digits}`, payload);
	}

	sendText(text: string) {
		if (!this.websocket || this.connectionState !== 'connected') {
			throw new Error('Cannot transmit without an active websocket connection.');
		}

		const payload = { type: 'speak_text', text } as const;
		this.websocket.send(JSON.stringify(payload));
		loggerState.log('transmission:out:text', `Sent text: ${text}`, payload);
	}
}

export const transmissionState = new TransmissionState();
