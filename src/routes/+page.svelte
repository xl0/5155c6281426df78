<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
</script>

<svelte:head>
	<title>NEON</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
	<Card class="w-full max-w-2xl text-center">
		<CardHeader>
			<p class="text-sm tracking-[0.3em] text-muted-foreground uppercase">NEON</p>
			<CardTitle class="mt-3 text-4xl">Dev tools online</CardTitle>
			<CardDescription class="mt-4 text-sm leading-6">
				Open the authentication cockpit to work through fragmented transmissions and test the NEON
				protocol flow.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<Button href="/dev">Open /dev</Button>
		</CardContent>
	</Card>
</div>
