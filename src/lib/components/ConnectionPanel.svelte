<script lang="ts">
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { consoleActions } from '$lib/console-actions.js';
	import { PROVIDERS } from '$lib/agent-settings';
	import { settingsState, transmissionState, uiState } from '$lib/state/index';
	import { toggleMode } from 'mode-watcher';

	let settingsTab = $state<'connection' | 'agent'>('connection');
	const selectedProviderLabel = $derived(
		PROVIDERS.find((option) => option.id === settingsState.provider)?.label ?? 'Select provider'
	);
	const selectedModelLabel = $derived(settingsState.model || 'Select model');
</script>

<Card>
	<Tabs bind:value={settingsTab} class="gap-4">
		<CardHeader>
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p class="text-sm tracking-widest text-muted-foreground uppercase">NEON Console</p>
				</div>
				<div class="flex flex-wrap items-center justify-end gap-3">
					<TabsList class="grid grid-cols-2">
						<TabsTrigger value="connection">Connection</TabsTrigger>
						<TabsTrigger value="agent">Agent Settings</TabsTrigger>
					</TabsList>
					<Button variant="outline" size="icon" class="relative" onclick={toggleMode}>
						<SunIcon
							class="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
					<Button variant="outline" size="icon" onclick={() => (uiState.docsOpen = true)}>
						<FileTextIcon class="size-5" />
						<span class="sr-only">Open reference docs</span>
					</Button>
				</div>
			</div>
		</CardHeader>

		<CardContent>
			<TabsContent value="connection" class="grid gap-4 lg:grid-cols-2">
				<label class="space-y-2">
					<span class="text-sm font-medium">WebSocket URL</span>
					<Input bind:value={settingsState.socketUrl} />
				</label>

				<label class="space-y-2">
					<span class="text-sm font-medium">Neon Code</span>
					<Input
						bind:value={settingsState.neonCode}
						placeholder="Enter vessel authorization code"
					/>
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
					<Select.Root type="single" bind:value={settingsState.provider}>
						<Select.Trigger class="w-full">{selectedProviderLabel}</Select.Trigger>
						<Select.Content>
							{#each PROVIDERS as option}
								<Select.Item value={option.id} label={option.label}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</label>

				<label class="space-y-2">
					<span class="text-sm font-medium">API Key</span>
					<Input
						bind:value={settingsState.apiKey}
						placeholder={settingsState.currentProviderConfig.placeholder}
					/>
				</label>

				<label class="space-y-2">
					<span class="text-sm font-medium">Model</span>
					<Select.Root type="single" bind:value={settingsState.model}>
						<Select.Trigger class="w-full">{selectedModelLabel}</Select.Trigger>
						<Select.Content>
							{#each settingsState.models as option}
								<Select.Item value={option} label={option}>{option}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</label>

				<p class="text-sm text-muted-foreground lg:col-span-2">
					These settings control the client-side AI provider, API key, and model selection.
				</p>
			</TabsContent>
		</CardContent>
	</Tabs>
</Card>
