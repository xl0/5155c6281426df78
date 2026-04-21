<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="dns-prefetch" href="https://en.wikipedia.org" />
	<link rel="preconnect" href="https://en.wikipedia.org" crossorigin="anonymous" />
</svelte:head>
<ModeWatcher />
{@render children()}
