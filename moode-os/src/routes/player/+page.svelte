<script lang="ts">
	import { onMount } from 'svelte';

	const videos = [
		{ thumbnail: 'MIIPn95YYHs', id: 'tgbNymZ7vqY' },
		{ thumbnail: '4JZ-o3iAJv4', id: 'dQw4w9WgXcQ' },
		{ thumbnail: '-R0UYHS8A_A', id: 'tgbNymZ7vqY' },
		{ thumbnail: 'FJ6ylSlgjAU', id: '3JZ_D3ELwOQ' },
		{ thumbnail: 'Nyx6SBixRE8', id: 'tgbNymZ7vqY' },
		{ thumbnail: 'DEWzT1geuPU', id: 'tgbNymZ7vqY' },
		{ thumbnail: 'wZ90ms3KpeI', id: 'tgbNymZ7vqY' }
	];

	let currentVideoId = $state('');
	let playerVisible = $state(false);
	let iframe: HTMLIFrameElement | undefined = $state();

	onMount(() => {
		const favicon = document.createElement('link');
		favicon.rel = 'icon';
		favicon.href = '/skater-skate.gif';
		document.head.appendChild(favicon);
		return () => favicon.remove();
	});

	function playVideo(videoId: string) {
		currentVideoId = videoId;
		playerVisible = true;
	}

	function pauseVideo() {
		iframe?.contentWindow?.postMessage(
			'{"event":"command","func":"pauseVideo","args":""}',
			'*'
		);
	}

	function resumeVideo() {
		iframe?.contentWindow?.postMessage(
			'{"event":"command","func":"playVideo","args":""}',
			'*'
		);
	}
</script>

<svelte:head>
	<title>Tracks</title>
</svelte:head>

<div class="main-container">
	<div class="grid">
		{#each videos as video}
			<img
				class="thumbnail"
				src="http://i3.ytimg.com/vi/{video.thumbnail}/hqdefault.jpg"
				alt="Video thumbnail"
				onclick={() => playVideo(video.id)}
			/>
		{/each}
	</div>

	{#if playerVisible}
		<div class="player-container">
			<iframe
				bind:this={iframe}
				src="https://www.youtube.com/embed/{currentVideoId}?autoplay=1"
				allow="autoplay"
			></iframe>
			<div class="custom-controls">
				<button onclick={pauseVideo}>Pause</button>
				<button onclick={resumeVideo}>Play</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.main-container {
		margin-top: 100px;
		padding: 200px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 80px;
		max-width: 800px;
		width: 100%;
	}

	.thumbnail {
		cursor: pointer;
		border-radius: 10px;
		overflow: hidden;
		transition: transform 0.3s;
	}

	.thumbnail:hover {
		transform: scale(1.05);
	}

	.player-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 20px;
	}

	iframe {
		border: none;
		width: 560px;
		height: 315px;
		border-radius: 10px;
	}

	.custom-controls {
		margin-top: 10px;
		display: flex;
		gap: 10px;
	}

	button {
		background-color: #ff4500;
		color: white;
		border: none;
		padding: 10px 15px;
		border-radius: 5px;
		cursor: pointer;
		transition: background 0.3s;
	}

	button:hover {
		background-color: #ff5733;
	}
</style>
