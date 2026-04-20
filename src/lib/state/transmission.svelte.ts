import { loggerState } from '$lib/state/logger.svelte';
import type { OutgoingPayload, ReceivedMessage } from '$lib/types';

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
			loggerState.log('transmission:unhandled', 'No incoming handler registered.', {
				message
			});
			return;
		}

		await this.incomingHandler(message);
	}

	send(payload: OutgoingPayload) {
		if (!this.websocket || this.connectionState !== 'connected') {
			throw new Error('Cannot transmit without an active websocket connection.');
		}

		this.websocket.send(JSON.stringify(payload));
		loggerState.log(
			'transmission:out',
			payload.type === 'enter_digits'
				? `Sent digits: ${payload.digits}`
				: `Sent text: ${payload.text}`,
			payload
		);
	}

	sendDigits(digits: string) {
		this.send({ type: 'enter_digits', digits });
	}

	sendText(text: string) {
		this.send({ type: 'speak_text', text });
	}
}

export const transmissionState = new TransmissionState();
