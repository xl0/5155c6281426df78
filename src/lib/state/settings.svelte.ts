import { PersistedState } from 'runed';

import { modelIds, providerConfig, type Provider } from '$lib/agent-settings';
import defaultResumeText from '../../../docs/resume.md?raw';

const defaultSocketUrl = 'wss://neonhealth.software/agent-puzzle/challenge';

class SettingsState {
	private persistedSocketUrl = new PersistedState('neon-socket-url', defaultSocketUrl);
	private persistedNeonCode = new PersistedState('neon-code', '');
	private persistedResumeText = new PersistedState('neon-resume-text', defaultResumeText.trim());
	private persistedProvider = new PersistedState<Provider>('neon-agent-provider', 'openai');
	private persistedModel = new PersistedState<string>('neon-agent-model', modelIds('openai')[0]);
	private persistedApiKeys = new PersistedState<Record<Provider, string>>('neon-agent-api-keys', {
		openrouter: '',
		anthropic: '',
		openai: '',
		google: ''
	});

	get socketUrl() {
		return this.persistedSocketUrl.current;
	}

	set socketUrl(value: string) {
		this.persistedSocketUrl.current = value;
	}

	get neonCode() {
		return this.persistedNeonCode.current;
	}

	set neonCode(value: string) {
		this.persistedNeonCode.current = value;
	}

	get resumeText() {
		return this.persistedResumeText.current;
	}

	set resumeText(value: string) {
		this.persistedResumeText.current = value;
	}

	get provider() {
		return this.persistedProvider.current;
	}

	set provider(value: Provider) {
		this.persistedProvider.current = value;
		const models = modelIds(value);
		if (!models.includes(this.persistedModel.current)) {
			this.persistedModel.current = models[0];
		}
	}

	get model() {
		return this.persistedModel.current;
	}

	set model(value: string) {
		this.persistedModel.current = value;
	}

	get models() {
		return modelIds(this.provider);
	}

	get apiKey() {
		return this.persistedApiKeys.current[this.provider] ?? '';
	}

	set apiKey(value: string) {
		this.persistedApiKeys.current = {
			...this.persistedApiKeys.current,
			[this.provider]: value
		};
	}

	get currentProviderConfig() {
		return providerConfig(this.provider);
	}
}

export const settingsState = new SettingsState();
