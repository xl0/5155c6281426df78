import { buildAdvice, reconstructMessage } from '$lib/protocol';
import type { OutgoingPayload } from '$lib/types';

import { agentState, settingsState, transmissionState } from '$lib/state/index';

type IncomingPayload =
	| { type: 'challenge'; message: { word: string; timestamp: number }[] }
	| { type: 'success' }
	| { type: 'error'; message: string };

async function handleSocketMessage(event: MessageEvent) {
	try {
		const payload = JSON.parse(String(event.data)) as IncomingPayload;

		if (payload.type === 'success') {
			transmissionState.logEvent('success', 'Access Granted', 'Authentication complete.');
			return;
		}

		if (payload.type === 'error') {
			transmissionState.logEvent('error', 'Rejected', payload.message);
			return;
		}

		const prompt = reconstructMessage(payload.message);
		transmissionState.setChallenge(prompt, payload.message);
		transmissionState.logEvent('incoming', 'Challenge', prompt, payload.message);

		try {
			const advice = await buildAdvice({ prompt });
			agentState.applyAdvice(advice);
		} catch (error) {
			agentState.applyAdvice({
				mode: null,
				label: 'Manual Review Needed',
				notes: [error instanceof Error ? error.message : 'Could not prepare a draft response.'],
				draft: '',
				auto: false
			});
		}
	} catch (error) {
		transmissionState.logEvent(
			'error',
			'Parse Error',
			error instanceof Error ? error.message : 'Unknown message error'
		);
	}
}

function connect() {
	if (transmissionState.socket) transmissionState.disconnect();

	transmissionState.resetForConnection();
	agentState.resetForConnection();

	const websocket = new WebSocket(settingsState.socketUrl);
	transmissionState.setSocket(websocket);

	websocket.onopen = () => {
		transmissionState.setConnected();
		transmissionState.logEvent('status', 'Connected', settingsState.socketUrl);
	};

	websocket.onclose = () => {
		transmissionState.setDisconnected();
		transmissionState.logEvent('status', 'Disconnected', 'Socket closed');
		transmissionState.clearSocket();
	};

	websocket.onerror = () => {
		transmissionState.logEvent('error', 'Socket Error', 'The websocket reported an error.');
	};

	websocket.onmessage = async (event) => {
		await handleSocketMessage(event);
	};
}

function disconnect() {
	transmissionState.disconnect();
}

function sendManualResponse() {
	const websocket = transmissionState.socket;

	if (!websocket || websocket.readyState !== WebSocket.OPEN) {
		transmissionState.logEvent('error', 'Send Failed', 'Connect to NEON before transmitting.');
		return;
	}

	if (!agentState.manualValue.trim()) {
		transmissionState.logEvent('error', 'Send Failed', 'Response payload is empty.');
		return;
	}

	if (agentState.manualMode === 'speak_text' && agentState.manualValue.length > 256) {
		transmissionState.logEvent(
			'error',
			'Send Failed',
			'speak_text responses must stay at or under 256 characters.'
		);
		return;
	}

	const payload: OutgoingPayload =
		agentState.manualMode === 'enter_digits'
			? { type: 'enter_digits', digits: agentState.manualValue }
			: { type: 'speak_text', text: agentState.manualValue };

	websocket.send(JSON.stringify(payload));
	transmissionState.logEvent('outgoing', 'Transmitted', JSON.stringify(payload));

	if (payload.type === 'speak_text') {
		transmissionState.rememberSpokenTransmission(payload.text);
	}
}

export const consoleActions = {
	connect,
	disconnect,
	sendManualResponse
};
