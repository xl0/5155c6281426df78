import { tool } from 'ai';
import { valibotSchema } from '@ai-sdk/valibot';
import { Parser } from 'expr-eval';
import * as v from 'valibot';

import { transmissionState } from '$lib/state/transmission.svelte';

const expressionParser = new Parser();

export const neonTools = {
	send_digits: tool({
		description: 'Transmit a keypad response to NEON as enter_digits.',
		inputSchema: valibotSchema(
			v.object({
				digits: v.pipe(v.string(), v.minLength(1))
			})
		),
		execute: async ({ digits }) => {
			transmissionState.sendDigits(digits);
			return { ok: true };
		}
	}),
	send_text: tool({
		description: 'Transmit a spoken-text response to NEON as speak_text.',
		inputSchema: valibotSchema(
			v.object({
				text: v.pipe(v.string(), v.minLength(1), v.maxLength(256))
			})
		),
		execute: async ({ text }) => {
			transmissionState.sendText(text);
			return { ok: true };
		}
	}),
	string_length: tool({
		description: 'Return the character length of a string.',
		inputSchema: valibotSchema(
			v.object({
				text: v.string()
			})
		),
		execute: async ({ text }) => ({ length: text.length })
	}),
	eval_js: tool({
		description:
			'Evaluate a JavaScript arithmetic expression. Supports numbers, operators, parentheses, commas, and Math.floor.',
		inputSchema: valibotSchema(
			v.object({
				expression: v.string()
			})
		),
		execute: async ({ expression }) => {
			const normalizedExpression = expression.replaceAll('Math.floor', 'floor');
			const result = expressionParser.evaluate(normalizedExpression);
			if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
				throw new Error('Expression did not evaluate to a finite number.');
			}

			return { result };
		}
	})
};
