<script lang="ts">
	import { Timer } from './timer';
	import { createEventDispatcher } from 'svelte';
	import { running, elapsedTime } from '@/stores';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	const timer = new Timer();
	let interval: NodeJS.Timer;
	export let countDown: number = 30;
	let currentCountDown: number = countDown;

	export function start(): any {
		timer.start();
		interval = setInterval(() => {
			elapsedTime.set(Math.round(timer.getTime() / 1000));
			currentCountDown = countDown - $elapsedTime;
			if (currentCountDown <= 0) {
				clearInterval(interval);
				// currentCountDown = countDown;
				dispatch('finish');
			}
		}, 100);
	}

	export function reset(): any {
		if (timer.isRunning) {
			timer.reset();
		}
		elapsedTime.set(0);
		clearInterval(interval);
		currentCountDown = countDown;
	}

	function setCountDown(newCountDown: number): any {
		countDown = newCountDown;
		currentCountDown = countDown;
	}

	$: displayTime = new Date(currentCountDown * 1000).toISOString().substring(14, 19);
</script>

<div class="timer">
	<h3 class:finish={!$running && $elapsedTime > 0}>{displayTime}</h3>
	{#if !$running && $elapsedTime === 0}
		<div class="seconds" transition:fade>
			<button
				class:active={countDown === 15}
				on:click={() => setCountDown(15)}
				on:mousedown|preventDefault>15</button
			>
			<button
				class:active={countDown === 30}
				on:click={() => setCountDown(30)}
				on:mousedown|preventDefault>30</button
			>
			<button
				class:active={countDown === 60}
				on:click={() => setCountDown(60)}
				on:mousedown|preventDefault>60</button
			>
			<button
				class:active={countDown === 90}
				on:click={() => setCountDown(90)}
				on:mousedown|preventDefault>90</button
			>
			<button
				class:active={countDown === 120}
				on:click={() => setCountDown(120)}
				on:mousedown|preventDefault>120</button
			>
			<span>'</span>
		</div>
	{/if}
</div>

<style>
	h3 {
		font-size: 3rem;
		font-weight: bold;
		text-align: center;
		color: var(--theme-blue-200);
		opacity: 1;
		transition: color 500ms ease, opacity 500ms ease;
	}

	h3.finish {
		color: var(--theme-orange-100);
		opacity: 0.2;
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
