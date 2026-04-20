import { ToolLoopAgent, stepCountIs, type ModelMessage } from 'ai';

import { neonTools } from '$lib/agent/tools';
import { createProviderModel } from '$lib/ai/model-factory';
import { loggerState } from '$lib/state/logger.svelte';
import { settingsState } from '$lib/state/settings.svelte';
import type { JsonValue, ReceivedMessage } from '$lib/types';

type NeonTools = typeof neonTools;

const SYSTEM_PROMPT = `You are NEON's autonomous co-pilot.

You must solve each checkpoint by using the available tools.
Rules:
- Reconstructing the incoming message has already been done for you.
- Use send_digits for keypad/frequency/value responses.
- Use send_text for spoken/transmitted voice responses.
- Use eval_js for arithmetic. Do not do arithmetic mentally.
- Use string_length to verify character-count constraints.
- The vessel authorization code and crew manifest are provided in context.
- The final verification may ask about one of your earlier sent responses, so use the prior sent-message history.
- End by calling exactly one send tool for the current checkpoint.
- Do not output JSON manually in text; use the send tools instead.
- Do not explain your reasoning unless it helps you decide which tool to call.`;

class AgentState {
	pendingChallenges = $state<ReceivedMessage[]>([]);
	isRunning = $state(false);
	lastError = $state<string | null>(null);
	conversationHistory = $state<ModelMessage[]>([]);
	private sessionAgent: ToolLoopAgent<never, NeonTools> | null = null;

	resetForConnection() {
		this.pendingChallenges = [];
		this.isRunning = false;
		this.lastError = null;
		this.conversationHistory = [];
		this.sessionAgent = null;
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

	private logStep(stepNumber: number, finishReason: string, toolCalls?: { toolName: string }[]) {
		loggerState.log(
			'agent:step',
			`Step ${stepNumber + 1} finished`,
			this.toJsonValue({ finishReason, toolCalls: toolCalls ?? [] })
		);
	}

	private toJsonValue(value: unknown): JsonValue {
		return JSON.parse(JSON.stringify(value ?? null)) as JsonValue;
	}

	private logToolResults(result: { steps?: Array<{ toolResults?: unknown[] }> }) {
		for (const step of result.steps ?? []) {
			for (const toolResult of step.toolResults ?? []) {
				const title =
					typeof toolResult === 'object' && toolResult !== null && 'toolName' in toolResult
						? String(toolResult.toolName)
						: 'tool_result';

				loggerState.log('agent:tool_result', title, this.toJsonValue(toolResult));
			}
		}
	}

	private async runChallenge(challenge: ReceivedMessage) {
		const apiKey = settingsState.apiKey.trim();
		if (!apiKey) {
			this.lastError = 'Set an API key before running the agent.';
			loggerState.log('agent:error', this.lastError);
			return;
		}

		this.lastError = null;
		this.sessionAgent ??= new ToolLoopAgent({
			model: createProviderModel(settingsState.provider, settingsState.model, apiKey),
			instructions: SYSTEM_PROMPT,
			tools: neonTools,
			stopWhen: stepCountIs(8),
			
		});

		const agent = this.sessionAgent;
		if (!agent) {
			this.lastError = 'Failed to initialize agent session.';
			loggerState.log('agent:error', this.lastError);
			return;
		}

		if (this.conversationHistory.length === 0) {
			const pre_context = {
				role: 'user',
				content: [
					`Neon Code: ${settingsState.neonCode || '(not set)'}`,
					'',
					'Crew Manifest / Resume:',
					settingsState.resumeText
				].join('\n')
			} as const;

			this.conversationHistory = [pre_context];
			loggerState.log('agent:message', 'Initialized persistent agent session.', pre_context);
		}

		loggerState.log('agent:challenge', challenge.text, { fragments: challenge.fragments });

		const challengeMessage: ModelMessage = {
			role: 'user',
			content: `${challenge.text}`
		};
		const messages: ModelMessage[] = [...this.conversationHistory, challengeMessage];

		try {
			const result = await agent.generate({
				messages,
				onStepFinish: async ({ stepNumber, toolCalls, finishReason }) => {
					this.logStep(
						stepNumber,
						String(finishReason),
						toolCalls?.map((toolCall) => ({ toolName: toolCall.toolName }))
					);
				},
			});

			this.logToolResults(result);

			const reply = result.text.trim();
			if (reply) {
				loggerState.log('agent:message', reply);
			}

			this.conversationHistory = [
				...this.conversationHistory,
				challengeMessage,
				...result.response.messages
			];
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Agent request failed.';
			this.lastError = message;
			loggerState.log('agent:error', message);
		}
	}
}

export const agentState = new AgentState();
