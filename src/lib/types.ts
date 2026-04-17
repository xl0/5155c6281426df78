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

export type ParsedChallenge = {
	mode: OutgoingPayload['type'] | null;
	label: string;
	notes: string[];
	draft: string;
	auto: boolean;
};

export type SpokenMemory = {
	prompt: string;
	text: string;
};

export type CharacterConstraint = {
	kind: 'exact' | 'range' | 'max';
	min: number;
	max: number;
};
