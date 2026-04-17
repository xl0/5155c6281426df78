import { connectedAdvice, defaultAdvice } from '$lib/protocol';
import type { OutgoingPayload, ParsedChallenge } from '$lib/types';

class AgentState {
	currentAdvice = $state<ParsedChallenge>(defaultAdvice);
	manualMode = $state<OutgoingPayload['type']>('speak_text');
	manualValue = $state('');
	messages = $state<string[]>([]);
	toolCalls = $state<string[]>([]);

	get manualLength() {
		return this.manualValue.length;
	}

	resetForConnection() {
		this.currentAdvice = connectedAdvice;
		this.messages = [];
		this.toolCalls = [];
	}

	applyAdvice(advice: ParsedChallenge) {
		this.currentAdvice = advice;
		if (advice.mode) {
			this.manualMode = advice.mode;
		}
		this.manualValue = advice.draft;
	}
}

export const agentState = new AgentState();
