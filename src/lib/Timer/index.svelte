<script lang="ts">
	import { Timer } from './timer';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const timer = new Timer();
	let interval: NodeJS.Timer;
	export let countDown: number = 30;
	let currentCountDown: number = countDown;

	export function start(): any {
		console.log('start');
		timer.start();
		interval = setInterval(() => {
			const timeInSeconds = Math.round(timer.getTime() / 1000);
			currentCountDown = countDown - timeInSeconds;
			if (currentCountDown <= 0) {
				clearInterval(interval);
				currentCountDown = countDown;
				dispatch('finish');
			}
		}, 100);
	}

	// TODO: there is a bug when resetting the timer with a countDown than the initial.

	export function reset(): any {
		console.log('reset');
		timer.reset();
		clearInterval(interval);
		currentCountDown = countDown;
	}

	$: displayTime = new Date(currentCountDown * 1000).toISOString().substring(14, 19);
</script>

<div class="timer">
	<h3>{displayTime}</h3>
	<div class="seconds">
		<button class:active={currentCountDown === 30} on:click={() => (currentCountDown = 30)}
			>30</button
		>
		<button class:active={currentCountDown === 60} on:click={() => (currentCountDown = 60)}
			>60</button
		>
		<button class:active={currentCountDown === 90} on:click={() => (currentCountDown = 90)}
			>90</button
		>
		<button class:active={currentCountDown === 120} on:click={() => (currentCountDown = 120)}
			>120</button
		>
		<span>'</span>
	</div>
</div>

<style>
	h3 {
		font-size: 2rem;
		font-weight: bold;
		text-align: center;
	}

	button {
		font-size: 1rem;
		background-color: transparent;
		border: none;
		color: var(--theme-blue-300);
		cursor: pointer;
		transition: color 500ms ease;
	}

	button.active {
		color: var(--theme-orange-100);
	}

	button:hover {
		color: var(--theme-blue-100);
	}

	.seconds {
		color: var(--theme-blue-300);
	}

	.timer {
		display: flex;
		justify-content: space-between;
		margin-top: 3rem;
		align-items: center;
	}

	.timer > * + * {
		margin-left: 2rem;
	}
</style>
