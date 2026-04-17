<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { CardContent } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { consoleActions } from '$lib/console-actions.js';
	import { PROVIDERS } from '$lib/agent-settings';
	import { settingsState, transmissionState } from '$lib/state/index';

	let settingsTab = $state<'connection' | 'agent'>('connection');
</script>

<CardContent>
	<Tabs bind:value={settingsTab} class="gap-4">
		<TabsList class="grid w-full grid-cols-2">
			<TabsTrigger value="connection">Connection</TabsTrigger>
			<TabsTrigger value="agent">Agent Settings</TabsTrigger>
		</TabsList>

		<TabsContent value="connection" class="grid gap-4 lg:grid-cols-2">
			<label class="space-y-2">
				<span class="text-sm font-medium">WebSocket URL</span>
				<Input bind:value={settingsState.socketUrl} />
			</label>

			<label class="space-y-2">
				<span class="text-sm font-medium">Neon Code</span>
				<Input bind:value={settingsState.neonCode} placeholder="Enter vessel authorization code" />
			</label>

			<label class="space-y-2 lg:col-span-2">
				<span class="text-sm font-medium">Crew Manifest / Resume</span>
				<Textarea
					bind:value={settingsState.resumeText}
					rows={7}
					placeholder="Paste the resume or crew manifest here for manual crew-transmission answers."
				/>
			</label>

			<div class="flex flex-wrap items-center gap-3 lg:col-span-2">
				<Button onclick={consoleActions.connect}
					>{transmissionState.connectionState === 'connected' ? 'Reconnect' : 'Connect'}</Button
				>
				<Button variant="outline" onclick={consoleActions.disconnect}>Disconnect</Button>
				<Badge variant="outline">Status: {transmissionState.connectionState}</Badge>
			</div>
		</TabsContent>

		<TabsContent value="agent" class="grid gap-4 lg:grid-cols-2">
			<label class="space-y-2">
				<span class="text-sm font-medium">Provider</span>
				<select
					bind:value={settingsState.provider}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
				>
					{#each PROVIDERS as option}
						<option value={option.id}>{option.label}</option>
					{/each}
				</select>
			</label>

			<label class="space-y-2">
				<span class="text-sm font-medium">API Key</span>
				<Input
					type="password"
					bind:value={settingsState.apiKey}
					placeholder={settingsState.currentProviderConfig.placeholder}
				/>
			</label>

			<label class="space-y-2">
				<span class="text-sm font-medium">Model</span>
				<select
					bind:value={settingsState.model}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
				>
					{#each settingsState.models as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</label>

			<p class="text-sm text-muted-foreground lg:col-span-2">
				These settings control the client-side AI provider, API key, and model selection.
			</p>
		</TabsContent>
	</Tabs>
</CardContent>
