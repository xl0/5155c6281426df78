import type { Fragment, ParsedChallenge } from '$lib/types';

export const defaultAdvice: ParsedChallenge = {
	mode: null,
	label: 'Waiting for a transmission',
	notes: ['Connect to NEON to receive fragmented challenges.'],
	draft: '',
	auto: false
};

export const connectedAdvice: ParsedChallenge = {
	mode: null,
	label: 'Waiting for a transmission',
	notes: ['Connection opened. Waiting for NEON to speak.'],
	draft: '',
	auto: false
};

export function reconstructMessage(fragments: Fragment[]) {
	return [...fragments]
		.sort((left, right) => left.timestamp - right.timestamp)
		.map((fragment) => fragment.word)
		.join(' ')
		.trim();
}

type AdviceOptions = {
	prompt: string;
};

export async function buildAdvice({ prompt }: AdviceOptions): Promise<ParsedChallenge> {
	return {
		mode: null,
		label: 'Agent Review Needed',
		notes: [
			'Prompt-specific drafting heuristics have been removed. Let the autonomous agent interpret and answer this transmission.'
		],
		draft: '',
		auto: false
	};
}
