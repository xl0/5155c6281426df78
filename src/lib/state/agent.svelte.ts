class AgentState {
	messages = $state<string[]>([]);
	toolCalls = $state<string[]>([]);

	resetForConnection() {
		this.messages = [];
		this.toolCalls = [];
	}
}

export const agentState = new AgentState();
