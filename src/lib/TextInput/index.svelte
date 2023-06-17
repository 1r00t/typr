<script context="module" lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { running, points, mistakesCorrected, mistakesTotal, words, elapsedTime } from '@/stores';

	let sentences: Writable<string[][]> = writable([[]]);
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Reload } from '@steeze-ui/radix-icons';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { identity } from 'svelte/internal';

	const dispatch = createEventDispatcher();

	let activeSentence: number = 0;
	let activeWord: number = 0;
	let activeLetter: number = 0;

	let inputElement: HTMLInputElement;
	let sentencesElement: HTMLDivElement;
	let currentElement: HTMLDivElement;
	let caretElement: HTMLDivElement;
	let outOfFocusElement: HTMLDivElement;
	let testLengthElement: HTMLDivElement;

	let inputValue: string = '';

	let caretLeft: number = -2;
	let caretTop: number = 0;

	let maxSentencesWidth = 0;

	function getRandomWord(): string {
		let randomIndex: number = Math.floor(Math.random() * $words.length);
		return $words[randomIndex];
	}

	function makeSentence(): string[] {
		const sentence: string[] = [];
		for (let i = 0; i < 20; i++) {
			const randomWord: string = getRandomWord();
			testLengthElement.innerHTML += `${randomWord} `;
			if (testLengthElement.clientWidth >= maxSentencesWidth) {
				testLengthElement.innerHTML = '';
				break;
			}
			sentence.push(randomWord);
			sentence.push(' ');
		}
		return sentence;
	}

	function makeSentences(n: number): string[][] {
		const newSentences: string[][] = [];
		for (let i = 0; i < n; i++) {
			newSentences.push(makeSentence());
		}
		return newSentences;
	}

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
			$sentences = [$sentences[1], $sentences[2], makeSentence()];
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

	function setPreviousWord()
	{
		if(activeWord == 0)
		{
			activeLetter = 0;
		}
		if (activeWord > 0) {
			activeWord--;
			activeLetter = 0;
		} 
		
		else if (activeSentence > 0) {
			activeSentence--;
			activeWord = $sentences[activeSentence].length - 1;
			activeLetter = 0;
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

	function evaluateInputWord() {
		if (inputValue === $sentences[activeSentence][activeWord]) {
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
		if (!$running) {
			dispatch('start');
		}
		setPreviousCharacter();
		setCurrentElement();
		if (currentElement.classList.contains('correct')) {
			currentElement.classList.remove('correct');
			if (
				currentElement.textContent === currentElement.textContent.toUpperCase() &&
				currentElement.textContent !== ' '
			) {
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
	function ctrlBackspace() {
		if (!$running) {
			dispatch('start');
		}
		setPreviousWord();
		setCurrentElement();
		if (currentElement.classList.contains('correct'))
		{
			currentElement.classList.remove('correct');
			if (currentElement.textContent === currentElement.textContent.toUpperCase() &&
				currentElement.textContent !== ' ') 
			{
				points.update((points) => points - (($sentences[activeSentence][activeWord].length)*2))
			} else 
			{
				points.update((points) => points - ($sentences[activeSentence][activeWord].length));
			}
		} 
		else if (currentElement.classList.contains('wrong')) 
		{
			currentElement.classList.remove('wrong');
			mistakesCorrected.update((mistakes) => mistakes - 1);
		}
		 else
		  {
			console.error('this should never happen!');
		}
		setCaret();
	}


	function letterTyped() {
		if (!$running) {
			dispatch('start');
		}
		setCurrentElement();
		evaluateInput();
		evaluateInputWord();
		setNextCharacter();
		setCurrentElement();
		setCaret();
		inputValue = '';
	}

	function onBlur() {
		sentencesElement.classList.add('blurred');
		outOfFocusElement.classList.add('show');
		caretElement.style.opacity = '0';
		if ($running && $elapsedTime > 0) {
			dispatch('pause');
		}
	}

	function onFocus() {
		sentencesElement.classList.remove('blurred');
		outOfFocusElement.classList.remove('show');
		caretElement.style.opacity = '1';
	}

	export function reset() {
		dispatch('reset');
		$sentences = makeSentences(3);
		activeSentence = 0;
		activeWord = 0;
		activeLetter = 0;
		setCurrentElement();
		setCaret();
		inputElement.disabled = false;
		inputElement.focus();
	}

	export function timeUp() {
		running.set(false);
		inputElement.disabled = true;
		sentencesElement.classList.add('blurred');
		inputElement.blur();
	}

	onMount(() => {
		inputElement.focus();
		testLengthElement.style.fontSize = '1.5em';
		testLengthElement.style.fontFamily = 'Quicksand';
		sentencesElement.style.opacity = '1';
		maxSentencesWidth = sentencesElement.clientWidth;
		$sentences = makeSentences(3);
	});
</script>

<div class="content">
	<!-- hidden character input -->
	<input
		type="text"
		bind:this={inputElement}
		bind:value={inputValue}
		on:input={letterTyped}
		on:keydown={(e) => {
			if (e.key === 'Backspace') {
				backspace();
			}
			if (e.key === 'Control') {
				ctrlBackspace();
			}
		}}
		on:focus={onFocus}
		on:blur={onBlur}
		aria-hidden="true"
		style="opacity: 0"
	/>

	<!-- hidden sentence length test input -->
	<div id="test-length" bind:this={testLengthElement} />

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
								<div class="letter">
									{#if letter === ' '}&nbsp;{:else}{letter}{/if}
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
	<button class="button-refresh" on:click={reset} on:mousedown|preventDefault>
		<Icon src={Reload} size="25px" />
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
		/* letter-spacing: 1px; */
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
	#test-length {
		position: absolute;
		visibility: hidden;
		height: auto;
		width: auto;
		white-space: nowrap;
	}
</style>
