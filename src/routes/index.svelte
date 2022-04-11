<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import TextInput from '$lib/TextInput/index.svelte';
	import Timer from '$lib/Timer/index.svelte';
	import Score from '$lib/Score/index.svelte';
	import Words from '$lib/Words/index.svelte';

	let timer: Timer;
	let textInput: TextInput;
	let score: Score;
</script>

<svelte:head>
	<title>typr</title>
</svelte:head>

<div class="score-and-words">
	<section class="score">
		<Score bind:this={score} />
	</section>

	<section>
		<Words />
	</section>
</div>

<section class="timer">
	<Timer bind:this={timer} countDown={30} on:finish={textInput.timeUp} />
</section>

<section class="text-input">
	<TextInput
		bind:this={textInput}
		on:start={timer.start}
		on:reset={() => {
			timer.reset();
			score.reset();
		}}
	/>
</section>

<style>
	.text-input {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		margin-top: 3rem;
	}

	.timer {
		margin-top: 3rem;
	}

	.score-and-words {
		margin-top: 3rem;
		display: flex;
		/* flex-direction: row; */
		align-items: center;
		justify-content: space-between;
	}
</style>
