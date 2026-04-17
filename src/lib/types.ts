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

export type OutgoingPayload = EnterDigitsPayload | SpeakTextPayload;

export type SessionEvent = {
	id: number;
	kind: 'status' | 'incoming' | 'outgoing' | 'error' | 'success';
	label: string;
	detail: string;
	fragments?: Fragment[];
};

export type SpokenMemory = {
	prompt: string;
	text: string;
};
