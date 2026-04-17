import { reconstructMessage } from '$lib/protocol';

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

export const consoleActions = {
	connect,
	disconnect
};
