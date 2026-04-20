import type { JsonValue, LogEntry } from '$lib/types';

class LoggerState {
	entries = $state<LogEntry[]>([]);

	reset() {
		this.entries = [];
	}

	log(type: string, title: string, metadata?: JsonValue) {
		this.entries = [
			...this.entries,
			{
				id: Date.now() + Math.random(),
				timestamp: new Date().toISOString(),
				type,
				title,
				metadata
			}
		];
	}
}

export const loggerState = new LoggerState();
