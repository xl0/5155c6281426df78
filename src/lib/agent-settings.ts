export type Provider = 'openrouter' | 'anthropic' | 'openai' | 'google';

export type ModelOption = {
	id: string;
	cheap?: boolean;
};

export const PROVIDERS: { id: Provider; label: string; placeholder: string }[] = [
	{ id: 'openrouter', label: 'OpenRouter', placeholder: 'sk-or-v1-...' },
	{ id: 'anthropic', label: 'Anthropic', placeholder: 'sk-ant-...' },
	{ id: 'openai', label: 'OpenAI', placeholder: 'sk-...' },
	{ id: 'google', label: 'Google', placeholder: 'AIza...' }
];

export const MODELS: Record<Provider, ModelOption[]> = {
	openrouter: [
		{ id: 'anthropic/claude-sonnet-4.6' },
		{ id: 'anthropic/claude-opus-4.6' },
		{ id: 'openai/gpt-5.4' },
		{ id: 'openai/gpt-5.4-mini', cheap: true },
		{ id: 'google/gemini-3.1-pro-preview' },
		{ id: 'google/gemini-3-flash-preview' }
	],
	anthropic: [
		{ id: 'claude-haiku-4-5', cheap: true },
		{ id: 'claude-sonnet-4-6' },
		{ id: 'claude-opus-4-6' }
	],
	openai: [{ id: 'gpt-5.4' }, { id: 'gpt-5.4-mini', cheap: true }],
	google: [{ id: 'gemini-2.5-pro' }, { id: 'gemini-2.5-flash', cheap: true }]
};

export function modelIds(provider: Provider): string[] {
	return MODELS[provider].map((model) => model.id);
}

export function providerConfig(provider: Provider) {
	return PROVIDERS.find((option) => option.id === provider)!;
}
