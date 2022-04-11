<script lang="ts">
	import { points, mistakesCorrected, mistakesTotal, elapsedTime, running } from '@/stores';

	let wpm: number = 0;
	let accuracy: number = 0;
	let interval: NodeJS.Timer;

	export function reset() {
		points.set(0);
		mistakesTotal.set(0);
		mistakesCorrected.set(0);
		wpm = 0;
		accuracy = 0;
		clearInterval(interval);
	}

	function getWpm() {
		wpm = Math.floor(($points / 5 - $mistakesCorrected) / ($elapsedTime / 60));
		if (!wpm || wpm === Infinity || wpm < 0) wpm = 0;
		return wpm;
	}

	function getAccuracy() {
		accuracy = Math.floor(($points / ($points + $mistakesCorrected)) * 100);
		if (!accuracy || accuracy === Infinity || accuracy < 0) accuracy = 0;
		return accuracy;
	}

	running.subscribe(() => {
		if ($running) {
			interval = setInterval(() => {
				wpm = getWpm();
				accuracy = getAccuracy();
			}, 1000);
		} else {
			clearInterval(interval);
		}
	});
</script>

<div class="scores" class:finished={!$running && $elapsedTime > 0}>
	<div class="score">
		<div class="title">wpm</div>
		<div class="number">{wpm}</div>
	</div>
	<div class="score">
		<div class="title">acc</div>
		<div class="number">{accuracy}</div>
		<div>%</div>
	</div>
</div>

<style>
	.scores {
		opacity: 0.6;
		transition: opacity 500ms ease;
	}

	.scores.finished {
		opacity: 1;
	}
	.score {
		display: flex;
		color: var(--theme-blue-200);
		font-size: 1.5rem;
		align-items: center;
	}

	.title {
		width: 4em;
	}

	.number {
		font-size: 2rem;
		font-weight: bold;
		margin-right: 0.25rem;
	}
</style>
