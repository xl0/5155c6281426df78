import type { AgentTool } from '@mariozechner/pi-agent-core';
import { Type } from '@mariozechner/pi-ai';
import { Parser } from 'expr-eval';

import { transmissionState } from '$lib/state/transmission.svelte';

const expressionParser = new Parser();

const sendDigitsParameters = Type.Object({
	digits: Type.String({ minLength: 1 })
});

const sendTextParameters = Type.Object({
	text: Type.String({ minLength: 1, maxLength: 256 }),
	minCharacters: Type.Optional(Type.Integer({ minimum: 1, maximum: 256 })),
	maxCharacters: Type.Optional(Type.Integer({ minimum: 1, maximum: 256 }))
});

const evalAndSendDigitsParameters = Type.Object({
	expression: Type.String(),
	appendPound: Type.Optional(Type.Boolean())
});

const wikiSummarySendWordParameters = Type.Object({
	title: Type.String({ minLength: 1 }),
	wordNumber: Type.Integer({ minimum: 1 })
});

const transmitNthWordParameters = Type.Object({
	text: Type.String({ minLength: 1 }),
	wordNumber: Type.Integer({ minimum: 1 })
});

// Strip leading and trailing punctuation so word positions match the visible summary words.
function cleanWord(word: string) {
	return word.replaceAll(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

function extractSummaryWords(text: string) {
	return text
		.split(/\s+/)
		.map((rawWord) => cleanWord(rawWord))
		.filter((word) => word.length > 0);
}

function evaluateExpression(expression: string) {
	const normalizedExpression = expression.replaceAll('Math.floor', 'floor');
	const result = expressionParser.evaluate(normalizedExpression);
	if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
		throw new Error('Expression did not evaluate to a finite number.');
	}

	return result;
}

function normalizeTransmissionText(text: string, minCharacters?: number, maxCharacters?: number) {
	const effectiveMinCharacters = Math.min(minCharacters ?? Infinity, maxCharacters ?? Infinity);

	let normalizedText = text;
	if (maxCharacters !== undefined && normalizedText.length > maxCharacters) {
		normalizedText = normalizedText.slice(0, maxCharacters);
	}
	if (effectiveMinCharacters !== Infinity && normalizedText.length < effectiveMinCharacters) {
		while (normalizedText.length < effectiveMinCharacters) {
			normalizedText += ' tadada';
		}
		normalizedText = normalizedText.slice(0, effectiveMinCharacters);
	}

	return normalizedText;
}

async function fetchSummary(title: string) {
	const response = await fetch(
		`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
		{
			headers: {
				accept: 'application/json'
			}
		}
	);

	if (!response.ok) {
		throw new Error(`Wikipedia summary request failed with status ${response.status}.`);
	}

	const summary = (await response.json()) as {
		title?: string;
		extract?: string;
		content_urls?: { desktop?: { page?: string } };
	};
	const extract = summary.extract?.trim();
	if (!extract) {
		throw new Error(`Wikipedia returned no summary extract for "${title}".`);
	}

	const parsedSummary = {
		title: summary.title ?? title,
		extract,
		url: summary.content_urls?.desktop?.page ?? null,
		words: extractSummaryWords(extract)
	};
	if (parsedSummary.words.length === 0) {
		throw new Error(`Wikipedia summary for "${title}" did not contain any words.`);
	}

	return parsedSummary;
}

const sendDigitsTool: AgentTool<typeof sendDigitsParameters> = {
	name: 'send_digits',
	label: 'Send Digits',
	description:
		'Transmit a keypad response exactly as provided. Use this for vessel/auth codes, keypad frequencies, and any raw hex or digit sequence, including # when needed.',
	parameters: sendDigitsParameters,
	executionMode: 'sequential',
	execute: async (_toolCallId, { digits }) => {
		transmissionState.sendDigits(digits);
		return {
			content: [{ type: 'text', text: 'Digits sent.' }],
			details: {
				ok: true,
				payload: { type: 'enter_digits', digits }
			}
		};
	}
};

const sendTextTool: AgentTool<typeof sendTextParameters> = {
	name: 'send_text',
	label: 'Send Text',
	description:
		'Transmit a spoken-text response for prompts that require speech rather than keypad entry. If the prompt gives character limits, pass minCharacters and/or maxCharacters so the text is padded or cropped before sending.',
	parameters: sendTextParameters,
	executionMode: 'sequential',
	execute: async (_toolCallId, { text, minCharacters, maxCharacters }) => {
		const normalizedText = normalizeTransmissionText(text, minCharacters, maxCharacters);
		transmissionState.sendText(normalizedText);
		return {
			content: [{ type: 'text', text: 'Text sent.' }],
			details: {
				ok: true,
				payload: { type: 'speak_text', text: normalizedText },
				minCharacters: minCharacters ?? null,
				maxCharacters: maxCharacters ?? null
			}
		};
	}
};

const evalAndSendDigitsTool: AgentTool<typeof evalAndSendDigitsParameters> = {
	name: 'eval_and_send_digits',
	label: 'Evaluate And Send Digits',
	description:
		'Evaluate a JavaScript arithmetic expression and immediately send the computed integer result via the keypad. Use this only for math/calculation prompts, not for vessel/auth codes or other raw keypad strings. Set appendPound to true if the prompt asks for the pound key.',
	parameters: evalAndSendDigitsParameters,
	executionMode: 'sequential',
	execute: async (_toolCallId, { expression, appendPound }) => {
		const result = evaluateExpression(expression);
		const digits = `${result}${appendPound ? '#' : ''}`;
		transmissionState.sendDigits(digits);

		return {
			content: [{ type: 'text', text: 'Digits sent.' }],
			details: {
				result,
				payload: { type: 'enter_digits', digits }
			}
		};
	}
};

const wikiSummarySendWordTool: AgentTool<typeof wikiSummarySendWordParameters> = {
	name: 'wiki_summary_send_word',
	label: 'Wikipedia Summary Send Word',
	description:
		'Fetch a Wikipedia summary for a title, extract the requested 1-based word, and immediately send that word as spoken text.',
	parameters: wikiSummarySendWordParameters,
	executionMode: 'sequential',
	execute: async (_toolCallId, { title, wordNumber }) => {
		const summary = await fetchSummary(title);
		const targetWord = summary.words[wordNumber - 1];
		if (!targetWord) {
			throw new Error(`Wikipedia summary for "${title}" has only ${summary.words.length} words.`);
		}

		transmissionState.sendText(targetWord);

		return {
			content: [{ type: 'text', text: 'Text sent.' }],
			details: {
				title: summary.title,
				wordNumber,
				targetWord,
				wordCount: summary.words.length,
				payload: { type: 'speak_text', text: targetWord },
				url: summary.url
			}
		};
	}
};

const transmitNthWordTool: AgentTool<typeof transmitNthWordParameters> = {
	name: 'transmit_nth_word',
	label: 'Transmit Nth Word',
	description:
		'Extract the requested 1-based word from a prior transmission string and immediately send that word as spoken text. If wordNumber is larger than the available word count, send the last word instead.',
	parameters: transmitNthWordParameters,
	executionMode: 'sequential',
	execute: async (_toolCallId, { text, wordNumber }) => {
		const words = extractSummaryWords(text);
		if (words.length === 0) {
			throw new Error('Could not extract any words from the provided text.');
		}

		const chosenIndex = Math.min(wordNumber - 1, words.length - 1);
		const targetWord = words[chosenIndex];
		transmissionState.sendText(targetWord);

		return {
			content: [{ type: 'text', text: 'Text sent.' }],
			details: {
				wordNumber,
				chosenWordNumber: chosenIndex + 1,
				targetWord,
				wordCount: words.length,
				payload: { type: 'speak_text', text: targetWord }
			}
		};
	}
};

export const neonTools = [
	sendDigitsTool,
	sendTextTool,
	evalAndSendDigitsTool,
	wikiSummarySendWordTool,
	transmitNthWordTool
] as const;
