import { Agent, type AgentEvent } from '@mariozechner/pi-agent-core';
import {
	getModel,
	type AssistantMessage,
	type KnownProvider,
	type Message
} from '@mariozechner/pi-ai';

import { neonTools } from '$lib/agent/tools';
import { loggerState } from '$lib/state/logger.svelte';
import { settingsState } from '$lib/state/settings.svelte';
import type { JsonValue, ReceivedMessage } from '$lib/types';

const SYSTEM_PROMPT = `You are an AI copilot, handle communications with NEON.

Respond as copilot, never as human.
Use one tool at a time, never batch them.


You must solve each checkpoint by using the available tools.
Rules:
- Use send_digits for any raw keypad response that should be sent unchanged, including vessel authorization codes, hex strings, frequencies, and values followed by #.
- Use send_text for all text responses. If NEON gives minimum or maximum character counts, pass them so the text is padded or cropped before sending.
- The vessel authorization code is a hex string. Never evaluate or transform it; send it unchanged with send_digits.
- Use eval_and_send_digits only for arithmetic prompts where you must compute a result before sending keypad digits.
- Use wiki_summary_send_word for knowledge archive / Wikipedia summary responses so lookup and sending happen in one step.
- Use transmit_nth_word for transmission-verification prompts that ask for the Nth word from an earlier text you already sent.
- Be very concise and deliberate.

Use plain replies only for diagnostic messages - never for messagse intended for NEON, and only on errors.

When evaluating the JS expression, check for syntax erros before eval and correct them.
When NEON asks the response to be between X and Y characters, aim for the middle of the interval, even if you have to pad the response with water.
`;
class AgentState {
	pendingChallenges = $state<ReceivedMessage[]>([]);
	isRunning = $state(false);
	lastError = $state<string | null>(null);
	private sessionAgent: Agent | null = null;
	private providerSessionId = this.createProviderSessionId();
	private abortAfterTerminalTool = false;

	private createProviderSessionId() {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return `neon-${crypto.randomUUID()}`;
		}

		return `neon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
	}

	resetForConnection() {
		this.pendingChallenges = [];
		this.isRunning = false;
		this.lastError = null;
		this.sessionAgent = null;
		this.providerSessionId = this.createProviderSessionId();
		this.abortAfterTerminalTool = false;
	}

	enqueueChallenge(challenge: ReceivedMessage) {
		this.pendingChallenges = [...this.pendingChallenges, challenge];
		void this.processQueue();
	}

	async processQueue() {
		if (this.isRunning) return;

		const next = this.pendingChallenges[0];
		if (!next) return;

		this.isRunning = true;
		this.pendingChallenges = this.pendingChallenges.slice(1);

		try {
			await this.runChallenge(next);
		} finally {
			this.isRunning = false;
			if (this.pendingChallenges.length > 0) {
				void this.processQueue();
			}
		}
	}

	private toJsonValue(value: unknown): JsonValue {
		return JSON.parse(JSON.stringify(value ?? null)) as JsonValue;
	}

	private contentToText(content: unknown): string {
		if (typeof content === 'string') return content.trim();
		if (!Array.isArray(content)) return '';

		return content
			.filter(
				(block): block is { type: 'text'; text: string } =>
					typeof block === 'object' && block !== null && 'type' in block && block.type === 'text'
			)
			.map((block) => block.text)
			.join('')
			.trim();
	}

	private isAssistantMessage(message: Message): message is AssistantMessage {
		return message?.role === 'assistant';
	}

	private messageMetadata(message: Message) {
		if (!this.isAssistantMessage(message)) {
			return { role: message.role };
		}

		return {
			role: message.role,
			provider: message.provider,
			model: message.model,
			stopReason: message.stopReason,
			usage: message.usage
		};
	}

	private handleAgentEvent(event: AgentEvent) {
		switch (event.type) {
			case 'message_start':
				loggerState.log(
					`agent:${event.message.role}:message_start`,
					`Started ${event.message.role} message`,
					undefined,
					event.message.role === 'assistant' ? 'normal' : 'debug'
				);
				return;
			case 'message_end': {
				const reply = this.contentToText(event.message.content);
				if (
					this.abortAfterTerminalTool &&
					this.isAssistantMessage(event.message) &&
					event.message.stopReason === 'aborted'
				) {
					return;
				}

				if (this.isAssistantMessage(event.message) && event.message.errorMessage) {
					loggerState.log(
						`agent:${event.message.role}:error`,
						event.message.errorMessage,
						this.toJsonValue(this.messageMetadata(event.message)),
						'error'
					);
					return;
				}

				if (reply) {
					loggerState.log(
						`agent:${event.message.role}:message_end`,
						reply,
						this.toJsonValue(this.messageMetadata(event.message))
					);
				}
				return;
			}
			case 'tool_execution_start':
				loggerState.log(
					'agent:tool_call',
					`${event.toolName}(${JSON.stringify(event.args ?? {})})`,
					this.toJsonValue({ toolCallId: event.toolCallId, args: event.args })
				);
				return;
			case 'tool_execution_end':
				loggerState.log(
					'agent:tool_result',
					`${event.toolName} -> ${event.result.content?.[0].text}`,
					this.toJsonValue({
						toolCallId: event.toolCallId,
						isError: event.isError,
						result: event.result
					})
				);

				if (
					!event.isError &&
					(event.toolName === 'send_digits' ||
						event.toolName === 'send_text' ||
						event.toolName === 'eval_and_send_digits' ||
						event.toolName === 'wiki_summary_send_word' ||
						event.toolName === 'transmit_nth_word')
				) {
					this.abortAfterTerminalTool = true;
					this.sessionAgent?.abort();
				}

				return;
			case 'turn_end':
				loggerState.log(
					'agent:turn_end',
					'Turn finished',
					this.toJsonValue({
						toolResults: event.toolResults.map((toolResult) => ({
							toolName: toolResult.toolName,
							isError: toolResult.isError
						}))
					})
				);
				return;

			case 'turn_start':
				loggerState.log('agent:turn_start', 'Turn started', undefined, 'debug');
				return;
		}
	}

	private createSessionAgent() {
		const apiKey = settingsState.apiKey.trim();
		if (!apiKey) {
			this.lastError = 'Set an API key before running the agent.';
			loggerState.log('agent:error', this.lastError, undefined, 'error');
			return null;
		}

		const bootstrapMessage = {
			role: 'user',
			content: [
				`Vessel authorization code: ${settingsState.neonCode || '(not set)'}`,
				'',
				'Crew Manifest / Resume:',
				settingsState.resumeText
			].join('\n'),
			timestamp: Date.now()
		} as const;

		const model = getModel(settingsState.provider as KnownProvider, settingsState.model as never);

		const agent = new Agent({
			initialState: {
				systemPrompt: SYSTEM_PROMPT,
				model,
				thinkingLevel: 'off',
				tools: [...neonTools],
				messages: [bootstrapMessage]
			},
			sessionId: this.providerSessionId,
			toolExecution: 'sequential',
			getApiKey: (provider) => (provider === settingsState.provider ? apiKey : undefined)
		});

		loggerState.log('agent:new', 'Initialized persistent agent session.', {
			system: SYSTEM_PROMPT,
			messsage: bootstrapMessage,
			model: model.id,
			provider: model.provider
		});

		agent.subscribe((event) => {
			this.handleAgentEvent(event);
		});

		return agent;
	}

	private async runChallenge(challenge: ReceivedMessage) {
		this.lastError = null;
		this.abortAfterTerminalTool = false;
		this.sessionAgent ??= this.createSessionAgent();

		const agent = this.sessionAgent;
		if (!agent) {
			this.lastError = 'Failed to initialize agent session.';
			loggerState.log('agent:error', this.lastError, undefined, 'error');
			return;
		}

		loggerState.log('agent:challenge', challenge.text, undefined, 'debug');

		try {
			await agent.prompt({
				role: 'user',
				content: challenge.text,
				timestamp: Date.now()
			});
			this.lastError = this.abortAfterTerminalTool ? null : (agent.state.errorMessage ?? null);
		} catch (error) {
			if (this.abortAfterTerminalTool) {
				this.lastError = null;
				return;
			}

			const message = error instanceof Error ? error.message : 'Agent request failed.';
			this.lastError = message;
			loggerState.log('agent:error', message, undefined, 'error');
		} finally {
			this.abortAfterTerminalTool = false;
		}
	}
}

export const agentState = new AgentState();
