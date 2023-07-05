<script context="module">
	import english_1000 from '$lib/Words/words_english_1000.json';
	import english_200 from '$lib/Words/words_english_200.json';
	import german_200 from '$lib/Words/words_german_200.json';
	import german_1000 from '$lib/Words/words_german_1000.json';
	import { words, running, elapsedTime } from '@/stores';
	import { fade } from 'svelte/transition';
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let activeLanguage = 'english';
	let activeWords = 'english_200';

	function setWords(newWords: string): any {
		if (newWords === 'english_1000') {
			words.set(english_1000);
			activeWords = 'english_1000';
		} else if (newWords === 'english_200') {
			words.set(english_200);
			activeWords = 'english_200';
		}
		else if(newWords === 'german_200'){
			words.set(german_200);
			activeWords = 'german_200';
		}
		else if(newWords === 'german_1000'){
			words.set(german_1000);
			activeWords = 'german_1000';
		}
		dispatch('wordsChanged');
	}
</script>

{#if !$running && $elapsedTime === 0}
	<div transition:fade>
		<ul>
			<li>
				<button
					class:active={activeLanguage === 'german' }
					on:click={() => {
						if(activeLanguage==='english'){
						activeLanguage = 'german';
						setWords('german_200');
						}
						else{
							activeLanguage = 'english';
							setWords('english_200');
						}
					}}
					on:mousedown|preventDefault><span>{activeLanguage}</span></button
				>
			</li>

		<ul>
           {#if activeLanguage === 'english'}
			<li>
				<button
					class:active={activeWords === 'english_200'}
					on:click={() => setWords('english_200')}
					on:mousedown|preventDefault>200</button
				>
			</li>
			<li>
				<button
					class:active={activeWords === 'english_1000'}
					on:click={() => setWords('english_1000')}
					on:mousedown|preventDefault>1000</button
				>
			</li>
			{/if}
			{#if activeLanguage === 'german'}
			<li>
				<button
					class:active={activeWords === 'german_200'}
					on:click={() => setWords('german_200')}
					on:mousedown|preventDefault>200</button
				>
			</li>	
			<li>
				<button
					class:active={activeWords === 'german_1000'}
					on:click={() => setWords('german_1000')}
					on:mousedown|preventDefault>1000</button
				>
			</li>
			{/if}

		</ul>
	</div>
{/if}

<style>
	div {
		display: flex;
	}
	span {
		padding: 10%;
		border-radius: 5px;
		background-color: var(--theme-blue-300);
		color: var(--theme-blue-100);
		opacity: 0.5;
		margin-right: 1rem;
		text-underline-offset: 0.25rem;
	}
	ul {
		list-style: none;
		display: flex;
		gap: 0.25rem;
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
</style>
