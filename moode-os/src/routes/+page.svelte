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
	<nav class="navbar">
		<p class="navbar-brand">moodEOS</p>
		<p class="navbar-status">☀️ Keep Hustling! ☁️</p>
		<p class="navbar-time">{time}</p>
	</nav>

	<div class="desktop-icons">
		<div class="desktop-icon" onclick={() => (welcomeVisible = true)}>
			<img src="/OS/Assets/notepad_retrox86.png" alt="Welcome" class="icons" />
			<p class="icon-name">Welcome</p>
		</div>
		<div class="desktop-icon">
			<img src="/OS/Assets/moode_OS.png" alt="Bootloader" class="icons" />
			<p class="icon-name">Bootloader</p>
		</div>
	</div>

	{#if welcomeVisible}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			id="welcome"
			class="welcome"
			use:draggable={undefined}
			style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
		>
			<div id="welcomeheader" class="welcomeheader">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="closebutton" onclick={() => (welcomeVisible = false)}></div>
				<p style="margin: 0; color: #fff; font-weight: 500">Welcome</p>
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

	.navbar {
		position: absolute;
		width: 100%;
		display: flex;
		backdrop-filter: blur(10px);
		background-color: rgba(0, 0, 0, 0.125);
		color: #fff;
		justify-content: space-between;
		gap: 32px;
	}

	.navbar-brand {
		margin-left: 16px;
		font-weight: 700;
		background-color: rgba(256, 256, 256, 0.125);
		padding: 4px 12px;
		border-radius: 16px;
	}

	.navbar-status {
		margin-left: 16px;
		background-color: rgba(256, 256, 256, 0.25);
		padding: 4px 12px;
		border-radius: 16px;
	}

	.navbar-time {
		margin-right: 16px;
		background-color: rgba(256, 256, 256, 0.125);
		padding: 4px 12px;
		border-radius: 16px;
	}

	.desktop-icons {
		padding-top: 500px;
		padding-left: 16px;
	}

	.desktop-icon {
		text-align: center;
		padding: 16px;
		filter: drop-shadow(0 0 8px black);
		width: fit-content;
		cursor: pointer;
	}

	.icons {
		width: 50px;
		height: 52px;
		margin-bottom: 0;
		border-radius: 16px;
	}

	.icon-name {
		margin-top: 0;
		font-family: 'Courier New', Courier, monospace;
		color: #fff;
	}

	.welcome {
		position: absolute;
		padding: 5px;
		padding-top: 20px;
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
		width: 16px;
		height: 16px;
		cursor: pointer;
		background-color: #ec6b5e;
		border-radius: 16px;
		border: solid 1px rgba(0, 0, 0, 0.25);
		margin-left: 6px;
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
