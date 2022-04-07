<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import TextInput from '$lib/TextInput/index.svelte';
	import Timer from '$lib/Timer/index.svelte';

	let timer: Timer;
	let textInput: TextInput;
</script>

<svelte:head>
	<title>typr</title>
</svelte:head>

<section class="timer">
	<Timer bind:this={timer} countDown={30} on:finish={textInput.timeUp} />
</section>

<section class="text-input">
	<TextInput bind:this={textInput} on:start={timer.start} on:reset={timer.reset()} />
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
</style>
