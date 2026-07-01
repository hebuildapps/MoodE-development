<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/OS/Assets/moode_OS.png" />
</svelte:head>
{@render children()}
