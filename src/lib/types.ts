export type Fragment = {
	word: string;
	timestamp: number;
};

export type EnterDigitsPayload = {
	type: 'enter_digits';
	digits: string;
};

export type SpeakTextPayload = {
	type: 'speak_text';
	text: string;
};

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export type LogLevel = 'error' | 'warning' | 'normal' | 'success';

export type LogEntry = {
	id: number;
	timestamp: string;
	type: string;
	level: LogLevel;
	title: string;
	metadata?: JsonValue;
};

export type ReceivedMessage = {
	id: number;
	text: string;
	fragments: Fragment[];
};
