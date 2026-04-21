import type { JsonValue, LogEntry, LogLevel } from '$lib/types';

class LoggerState {
	entries = $state<LogEntry[]>([]);

	reset() {
		this.entries = [];
	}

	log(type: string, title: string, metadata?: JsonValue, level: LogLevel = 'normal') {
		this.entries = [
			...this.entries,
			{
				id: Date.now() + Math.random(),
				timestamp: new Date().toISOString(),
				type,
				level,
				title,
				metadata
			}
		];
	}
}

export const loggerState = new LoggerState();
