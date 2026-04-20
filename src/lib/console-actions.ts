import { reconstructMessage } from '$lib/protocol';

import { agentState, loggerState, settingsState, transmissionState } from '$lib/state/index';

type IncomingPayload =
	| { type: 'challenge'; message: { word: string; timestamp: number }[] }
	| { type: 'success' }
	| { type: 'error'; message: string };

async function handleSocketMessage(event: MessageEvent) {
	try {
		const payload = JSON.parse(String(event.data)) as IncomingPayload;

		if (payload.type === 'success') {
			loggerState.log('transmission:success', 'Authentication complete.');
			return;
		}

		if (payload.type === 'error') {
			loggerState.log('transmission:error', payload.message);
			return;
		}

		const prompt = reconstructMessage(payload.message);
		await transmissionState.handleIncomingMessage(prompt, payload.message);
	} catch (error) {
		loggerState.log(
			'transmission:error',
			error instanceof Error ? error.message : 'Unknown message error',
			{ rawData: String(event.data) }
		);
	}
}

function connect() {
	if (transmissionState.socket) transmissionState.disconnect();

	loggerState.reset();
	transmissionState.resetForConnection();
	agentState.resetForConnection();
	transmissionState.setIncomingHandler((message) => {
		agentState.enqueueChallenge(message);
	});

	const websocket = new WebSocket(settingsState.socketUrl);
	transmissionState.setSocket(websocket);

	websocket.onopen = () => {
		transmissionState.setConnected();
		loggerState.log('transmission:status', `Connected to ${settingsState.socketUrl}`);
	};

	websocket.onclose = () => {
		transmissionState.setDisconnected();
		loggerState.log('transmission:status', 'Socket closed');
		transmissionState.clearSocket();
	};

	websocket.onerror = () => {
		loggerState.log('transmission:error', 'The websocket reported an error.');
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
