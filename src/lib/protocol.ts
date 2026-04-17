import type { CharacterConstraint, Fragment, ParsedChallenge, SpokenMemory } from '$lib/types';

const ordinalWords = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];

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

export function parseCharacterConstraint(prompt: string): CharacterConstraint | null {
	const exact = prompt.match(/exactly\s+(\d+)\s+characters/i);
	if (exact) {
		return { kind: 'exact', min: Number(exact[1]), max: Number(exact[1]) };
	}

	const range = prompt.match(/between\s+(\d+)\s+and\s+(\d+)\s+characters/i);
	if (range) {
		return { kind: 'range', min: Number(range[1]), max: Number(range[2]) };
	}

	const max = prompt.match(/max\s+(\d+)\s+characters/i);
	if (max) {
		return { kind: 'max', min: 0, max: Number(max[1]) };
	}

	return null;
}

function wordsFromText(text: string) {
	return text.split(/\s+/).filter(Boolean);
}

function ordinalToIndex(raw: string) {
	const numeric = raw.match(/(\d+)/);
	if (numeric) return Number(numeric[1]) - 1;

	const spelled = ordinalWords.indexOf(raw.toLowerCase());
	return spelled >= 0 ? spelled : -1;
}

function extractMathExpression(prompt: string) {
	const patterns = [
		/calculate\s+(.+?)(?:\s+and\s+(?:transmit|enter|respond)|[.?!]|$)/i,
		/what(?:'s| is)\s+(.+?)(?:[?]|\s+and\s+(?:transmit|enter|respond)|$)/i,
		/expression\s+(.+?)(?:[.?!]|$)/i
	];

	for (const pattern of patterns) {
		const match = prompt.match(pattern);
		if (!match) continue;

		const expression = match[1]
			.trim()
			.replace(/followed by the pound key.*/i, '')
			.trim();
		if (expression) return expression;
	}

	return '';
}

function safelyEvaluateExpression(expression: string) {
	if (!/^[\d\s+\-*/%().,Mathfloor]+$/.test(expression.replace(/Math\.floor/g, 'Mathfloor'))) {
		throw new Error('Unsupported expression format');
	}

	const result = Function(`"use strict"; return (${expression});`)();
	if (!Number.isFinite(result)) {
		throw new Error('Expression did not produce a finite number');
	}

	return String(Math.trunc(result));
}

async function getKnowledgeArchiveWord(prompt: string) {
	const match = prompt.match(
		/(?:speak|transmit)\s+the\s+(.+?)\s+word\s+in\s+the\s+knowledge archive entry for\s+(.+?)(?:[.?!]|$)/i
	);
	if (!match) {
		throw new Error('Could not parse the knowledge archive request');
	}

	const index = ordinalToIndex(match[1]);
	if (index < 0) {
		throw new Error('Unsupported word index');
	}

	const title = match[2].trim();
	const response = await fetch(
		`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
	);
	if (!response.ok) {
		throw new Error(`Wikipedia request failed with ${response.status}`);
	}

	const data = (await response.json()) as { extract?: string };
	const words = wordsFromText(data.extract ?? '');
	const word = words[index];
	if (!word) {
		throw new Error('Requested word is outside the article summary');
	}

	return word.replace(/^['"“”‘’()\[\]{}]+|['"“”‘’()\[\]{}.,!?;:]+$/g, '');
}

function getVerificationWord(prompt: string, spokenMemory: SpokenMemory[]) {
	if (!spokenMemory.length) {
		throw new Error('No earlier spoken transmissions recorded yet');
	}

	const ordinalMatch = prompt.match(/(?:the\s+)?(.+?)\s+word/i);
	const wordIndex = ordinalMatch ? ordinalToIndex(ordinalMatch[1]) : -1;
	if (wordIndex < 0) {
		throw new Error('Could not parse the verification word position');
	}

	let memoryIndex = spokenMemory.length - 1;
	if (/first transmission/i.test(prompt)) memoryIndex = 0;
	if (/second transmission/i.test(prompt)) memoryIndex = 1;
	if (/third transmission/i.test(prompt)) memoryIndex = 2;
	if (/last transmission|previous transmission/i.test(prompt))
		memoryIndex = spokenMemory.length - 1;

	const referencedPrompt = prompt.match(/about\s+(.+?)(?:[.?!]|$)/i)?.[1]?.toLowerCase();
	if (referencedPrompt) {
		const foundIndex = spokenMemory.findIndex((memory) =>
			memory.prompt.toLowerCase().includes(referencedPrompt)
		);
		if (foundIndex >= 0) {
			memoryIndex = foundIndex;
		}
	}

	const memory = spokenMemory[memoryIndex];
	if (!memory) {
		throw new Error('Referenced spoken transmission is not available');
	}

	const word = wordsFromText(memory.text)[wordIndex];
	if (!word) {
		throw new Error('Requested word is outside the saved transmission');
	}

	return word.replace(/^['"“”‘’()\[\]{}]+|['"“”‘’()\[\]{}.,!?;:]+$/g, '');
}

type AdviceOptions = {
	prompt: string;
	neonCode: string;
	spokenMemory: SpokenMemory[];
	characterConstraint: CharacterConstraint | null;
};

export async function buildAdvice({
	prompt,
	neonCode,
	spokenMemory,
	characterConstraint
}: AdviceOptions): Promise<ParsedChallenge> {
	const lowerPrompt = prompt.toLowerCase();

	if (/knowledge archive entry/i.test(prompt)) {
		const word = await getKnowledgeArchiveWord(prompt);
		return {
			mode: 'speak_text',
			label: 'Knowledge Archive Query',
			notes: ['Fetched the Wikipedia summary and extracted the requested word.'],
			draft: word,
			auto: true
		};
	}

	if (
		/earlier crew manifest|earlier response|last transmission|previous transmission/i.test(
			lowerPrompt
		)
	) {
		const word = getVerificationWord(prompt, spokenMemory);
		return {
			mode: 'speak_text',
			label: 'Transmission Verification',
			notes: ['Using saved spoken responses from this session.'],
			draft: word,
			auto: true
		};
	}

	if (/calculate|math\.floor|plus|minus|\*|\/|%|\(/i.test(prompt)) {
		const expression = extractMathExpression(prompt);
		if (!expression) {
			throw new Error('Could not isolate the arithmetic expression');
		}

		const value = safelyEvaluateExpression(expression);
		const suffix = /pound key/i.test(prompt) ? '#' : '';
		return {
			mode: 'enter_digits',
			label: 'Computational Assessment',
			notes: [`Evaluated: ${expression}`],
			draft: `${value}${suffix}`,
			auto: true
		};
	}

	if (/authorization code|neon code|vessel/i.test(lowerPrompt)) {
		return {
			mode: 'enter_digits',
			label: 'Vessel Identification',
			notes: neonCode
				? ['Using the Neon Code from the briefing form.']
				: ['Enter the Neon Code above, then send it.'],
			draft: neonCode,
			auto: Boolean(neonCode)
		};
	}

	const frequencyMatch = prompt.match(/(?:respond on|enter|press)\s+(?:frequency\s+)?([\d#]+)/i);
	if (frequencyMatch) {
		return {
			mode: 'enter_digits',
			label: 'Signal Handshake',
			notes: ['Prompt includes a keypad value directly.'],
			draft: frequencyMatch[1],
			auto: true
		};
	}

	if (/crew|resume|background|education|experience|skills|project|deployment/i.test(lowerPrompt)) {
		const notes = [
			'Answer from the resume field and keep the response within any stated character limit.'
		];
		if (characterConstraint) {
			notes.push(
				`Current constraint: ${characterConstraint.min}-${characterConstraint.max} characters.`
			);
		}

		return {
			mode: 'speak_text',
			label: 'Crew Manifest Transmission',
			notes,
			draft: '',
			auto: false
		};
	}

	return {
		mode: null,
		label: 'Manual Review Needed',
		notes: [
			'The prompt did not match a known checkpoint pattern. Review the protocol and respond manually.'
		],
		draft: '',
		auto: false
	};
}
