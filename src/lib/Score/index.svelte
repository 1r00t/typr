<script lang="ts">
	import { points, mistakesCorrected, mistakesTotal, elapsedTime, running } from '@/stores';

	let wpm: number = 0;
	let accuracy: number = 0;

	export function reset() {
		points.set(0);
		mistakesTotal.set(0);
		mistakesCorrected.set(0);
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
		let interval: NodeJS.Timer;
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

wpm: {wpm} <br />
accuracy: {accuracy}%
