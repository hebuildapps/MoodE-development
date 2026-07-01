<script lang="ts">
	import { draggable } from '$lib/actions/draggable';

	let time = $state(new Date().toLocaleString());
	let welcomeVisible = $state(true);

	$effect(() => {
		const id = setInterval(() => (time = new Date().toLocaleString()), 1000);
		return () => clearInterval(id);
	});
</script>

<svelte:head>
	<title>moodE OS | Say Hello to MoodE!</title>
</svelte:head>

<div
	class="desktop"
	style="background-image: url(/OS/Assets/wall.gif); background-size: cover; background-repeat: no-repeat;"
>
	<div class="desktop-icons">
		<button type="button" class="desktop-icon" onclick={() => (welcomeVisible = true)}>
			<img src="/OS/Assets/notepad_retrox86.png" alt="Welcome" class="icons" />
			<p class="icon-name">Welcome</p>
		</button>
		<button type="button" class="desktop-icon">
			<img src="/OS/Assets/moode_OS.png" alt="Bootloader" class="icons" />
			<p class="icon-name">Bootloader</p>
		</button>
	</div>

	<div class="bottom-bar">
		<p class="bar-status">☀️ Keep Hustling! ☁️</p>
		<p class="bar-time">{time}</p>
	</div>

	{#if welcomeVisible}
		<div
			id="welcome"
			class="welcome"
			use:draggable={undefined}
			style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
		>
			<div id="welcomeheader" class="welcomeheader">
				<button type="button" class="closebutton" onclick={() => (welcomeVisible = false)}></button>
			</div>
			<div class="welcome-content">
				<img
					src="/OS/Assets/moode_OS.png"
					alt="moodEOS"
					style="width: 64px; height: 64px; border-radius: 32px; object-fit: cover"
				/>
				<h1 style="margin: 4px">moodEOS</h1>
				<p style="margin: 0">
					<dfn>moodE OS</dfn> is a feature-limited <abbr title="Operating System">OS</abbr> to link your
					<br />
					<code>real-life</code> and <code class="code2">digital-life</code> together!
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.desktop {
		font-family: Noto Sans, system-ui, sans-serif;
		height: 100vh;
		margin: 0;
	}

	.desktop-icons {
		position: absolute;
		top: 16px;
		left: 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.desktop-icon {
		all: unset;
		cursor: pointer;
		text-align: center;
		padding: 16px;
		filter: drop-shadow(0 0 8px black);
		width: fit-content;
	}

	.desktop-icon:hover {
		filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
	}

	.icons {
		width: 50px;
		height: 52px;
		display: block;
		margin: 0 auto;
		border-radius: 16px;
	}

	.icon-name {
		margin-top: 4px;
		font-family: 'Courier New', Courier, monospace;
		color: #fff;
		font-size: 14px;
	}

	.bottom-bar {
		position: fixed;
		bottom: 20px;
		left: 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.bar-status {
		background-color: rgba(256, 256, 256, 0.25);
		padding: 4px 12px;
		border-radius: 16px;
		margin: 0;
		width: fit-content;
		color: #fff;
	}

	.bar-time {
		background-color: rgba(256, 256, 256, 0.125);
		padding: 4px 12px;
		border-radius: 16px;
		margin: 0;
		width: fit-content;
		color: #fff;
	}

	.welcome {
		position: absolute;
		padding: 5px;
		border: 1px solid #000;
		background: #fff;
		display: flex;
		flex-direction: column;
		border-radius: 16px;
		backdrop-filter: blur(4px);
		background-color: rgba(0, 0, 0, 0.125);
	}

	.welcome-content {
		margin-top: 5px;
		border: 0.5px;
		border-radius: 15px;
		padding: 30px;
		background-color: #fff;
	}

	.closebutton {
		all: unset;
		width: 16px;
		height: 16px;
		cursor: pointer;
		background-color: #ec6b5e;
		border-radius: 16px;
		border: solid 1px rgba(0, 0, 0, 0.25);
		margin-left: 6px;
		flex-shrink: 0;
	}

	.closebutton:hover {
		filter: brightness(1.1);
	}

	.welcomeheader {
		width: 100%;
		display: flex;
		align-items: center;
		cursor: move;
		justify-content: space-between;
		margin-top: 1px;
	}

	code {
		color: #f80000;
		font-size: 16px;
		font-family: 'Courier New', Courier, monospace;
		padding: 4px;
		margin: 10px 0;
		overflow-x: auto;
	}

	:global(.code2) {
		color: blue;
	}
</style>
