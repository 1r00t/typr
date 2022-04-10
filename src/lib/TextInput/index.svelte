<script context="module" lang="ts">
	import words from './1000_english_words.json'; // stolen from monkeytype.com
	import { writable, type Writable } from 'svelte/store';
	import { running, points, mistakesCorrected, mistakesTotal } from '@/stores';

	function getRandomWord(): string {
		let randomIndex: number = Math.floor(Math.random() * words.length);
		return words[randomIndex];
	}

	function getRandomWords(count: number): Array<string> {
		let randomWords: Array<string> = [];
		for (let i = 0; i < count; i++) {
			randomWords.push(getRandomWord());
			randomWords.push(' ');
		}
		return randomWords;
	}

	function makeSentences() {
		let newSentences: Array<Array<string>> = [];
		for (let i = 0; i < 3; i++) {
			newSentences.push(getRandomWords(10));
		}
		return newSentences;
	}

	let sentences: Writable<string[][]> = writable([[]]);
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Refresh } from '@steeze-ui/heroicons';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let activeSentence: number = 0;
	let activeWord: number = 0;
	let activeLetter: number = 0;

	let inputElement: HTMLInputElement;
	let sentencesElement: HTMLDivElement;
	let currentElement: HTMLDivElement;
	let caretElement: HTMLDivElement;
	let outOfFocusElement: HTMLDivElement;
	// let testLengthElement: HTMLDivElement;

	let inputValue: string = '';

	let caretLeft: number = -2;
	let caretTop: number = 0;

	function setNextCharacter() {
		activeLetter++;
		if (activeLetter >= $sentences[activeSentence][activeWord].length) {
			activeWord++;
			activeLetter = 0;
		}
		if (activeWord >= $sentences[activeSentence].length) {
			activeSentence++;
			activeWord = 0;
			activeLetter = 0;
		}
		if (activeSentence >= $sentences.length) {
			activeSentence = 0;
			activeWord = 0;
			activeLetter = 0;
		}
		if (activeSentence === 2) {
			// remove top sentence and add bottom sentence
			$sentences = [$sentences[1], $sentences[2], getRandomWords(10)];
			activeSentence = 1;
		}
	}

	function setPreviousCharacter() {
		if (activeLetter > 0) {
			activeLetter--;
		} else if (activeWord > 0) {
			activeWord--;
			activeLetter = $sentences[activeSentence][activeWord].length - 1;
		} else if (activeSentence > 0) {
			activeSentence--;
			activeWord = $sentences[activeSentence].length - 1;
			activeLetter = $sentences[activeSentence][activeWord].length - 1;
		}
	}

	function evaluateInput() {
		if (inputValue === $sentences[activeSentence][activeWord][activeLetter]) {
			currentElement.classList.add('correct');
			if (inputValue === inputValue.toUpperCase() && inputValue !== ' ') {
				points.update((points) => points + 2);
			} else {
				points.update((points) => points + 1);
			}
		} else {
			currentElement.classList.add('wrong');
			mistakesTotal.update((mistakes) => mistakes + 1);
			mistakesCorrected.update((mistakes) => mistakes + 1);
		}
	}

	function setCaret() {
		caretLeft = currentElement.offsetLeft - 2;
		caretTop = currentElement.offsetTop;
	}

	function setCurrentElement() {
		currentElement = sentencesElement.children[activeSentence].children[activeWord].children[
			activeLetter
		] as HTMLDivElement;
	}

	function backspace() {
		setPreviousCharacter();
		setCurrentElement();
		if (currentElement.classList.contains('correct')) {
			currentElement.classList.remove('correct');
			if (currentElement.textContent === currentElement.textContent.toUpperCase()) {
				points.update((points) => points - 2);
			} else {
				points.update((points) => points - 1);
			}
		} else if (currentElement.classList.contains('wrong')) {
			currentElement.classList.remove('wrong');
			mistakesCorrected.update((mistakes) => mistakes - 1);
		} else {
			console.error('this should never happen!');
		}
		setCaret();
	}

	function letterTyped() {
		if (!$running) {
			running.set(true);
			dispatch('start');
		}
		setCurrentElement();
		evaluateInput();
		setNextCharacter();
		setCurrentElement();
		setCaret();
		inputValue = '';
	}

	function reset() {
		running.set(false);
		dispatch('reset');
		$sentences = makeSentences();
		activeSentence = 0;
		activeWord = 0;
		activeLetter = 0;
		setCurrentElement();
		setCaret();
		inputElement.disabled = false;
		inputElement.focus();
	}

	export function timeUp() {
		console.log('time up');
		if ($running) {
			running.set(false);
		}
		inputElement.disabled = true;
		sentencesElement.classList.add('blurred');
	}

	onMount(() => {
		inputElement.focus();
		sentencesElement.style.opacity = '1'; // it somehow refreshes on page load
		// first add the words to the hidden test-length element and check width
		// if length exceeds the width of the element, stop adding words
		$sentences = makeSentences();
	});
</script>

<div class="content">
	<!-- hidden input -->
	<input
		type="text"
		bind:this={inputElement}
		bind:value={inputValue}
		on:input={letterTyped}
		on:keydown={(e) => {
			if (e.key === 'Backspace') {
				backspace();
			}
		}}
		on:focus={() => {
			sentencesElement.classList.remove('blurred');
			outOfFocusElement.classList.remove('show');
			caretElement.style.opacity = '1';
		}}
		on:blur={() => {
			sentencesElement.classList.add('blurred');
			outOfFocusElement.classList.add('show');
			caretElement.style.opacity = '0';
		}}
		aria-hidden="true"
		style="opacity: 0"
	/>

	<!-- hidden test length div (https://stackoverflow.com/a/118251) -->
	<!-- <div id="test-length" bind:this={testLengthElement} /> -->

	<!-- typing area -->
	<div class="sentences-container">
		<div class="sentences" bind:this={sentencesElement}>
			{#each $sentences as sentence (sentence)}
				<div
					class="sentence"
					out:fly={{ y: -20, duration: 100 }}
					in:fly={{ y: 20, duration: 100 }}
					animate:flip={{ duration: 100 }}
				>
					{#each sentence as word}
						<span class="word">
							{#each word as letter}
								<div class="letter" class:space={letter === ' '}>
									{letter}
								</div>
							{/each}
						</span>
					{/each}
				</div>
			{/each}
			<div class="caret" style="left: {caretLeft}px; top: {caretTop}px;" bind:this={caretElement} />
		</div>
		<div
			class="out-of-focus"
			on:click={() => inputElement.focus()}
			on:mousedown|preventDefault
			bind:this={outOfFocusElement}
		>
			Click here to type
		</div>
	</div>

	<!-- refresh button -->
	<button class="button-refresh" on:click={reset}>
		<Icon src={Refresh} size="25px" />
		restart
	</button>
</div>

<style>
	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.button-refresh {
		cursor: pointer;
		display: flex;
		font-size: 1.1rem;
		font-weight: 700;
		justify-content: center;
		gap: 0.5rem;
		align-items: center;
		margin-top: 3rem;
		width: 8rem;
		height: 3rem;
		background-color: transparent;
		border: none;
		color: var(--theme-blue-300);
		border: 0.1em solid transparent;
		border-radius: 10px;
		transition: color 500ms ease, background-color 300ms ease;
	}
	.button-refresh:focus {
		outline: none;
		background-color: var(--theme-blue-300);
		color: var(--theme-black);
	}
	.button-refresh:hover {
		color: var(--theme-orange-100);
	}
	.sentences {
		display: flex;
		opacity: 0;
		flex-direction: column;
		font-size: 1.5em;
		letter-spacing: 1px;
		color: var(--theme-blue-300);
		position: relative;
		transition: filter 300ms ease-out, opacity 300ms ease-out;
	}
	.sentences:global(.blurred) {
		filter: blur(5px);
	}
	.sentence {
		display: flex;
	}
	.word {
		display: flex;
	}
	.letter {
		transition: color 0ms ease;
	}
	.space {
		width: 0.4em;
	}
	.letter:global(.correct) {
		color: var(--theme-orange-100);
		transition: color 2000ms ease;
	}
	.letter:global(.wrong) {
		position: relative;
		color: var(--theme-red-300);
		white-space: pre;
		transition: color 500ms ease;
	}
	.letter:global(.wrong)::after {
		content: '';
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		width: 100%;
		background-color: var(--theme-red-300);
	}
	.caret {
		position: absolute;
		height: 1.2em;
		border-right: 2px solid var(--theme-white);
		transition: opacity 500ms ease, left 50ms ease;
	}
	.sentences-container {
		position: relative;
	}
	.out-of-focus {
		opacity: 0;
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--theme-blue-100);
		transition: opacity 0ms ease;
	}
	.out-of-focus:global(.show) {
		opacity: 1;
		transition: opacity 1000ms ease;
	}
	/* #test-length {
		position: absolute;
		visibility: hidden;
		height: auto;
		width: auto;
		white-space: nowrap;
	} */
</style>
