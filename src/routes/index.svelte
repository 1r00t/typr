<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import TextInput from '$lib/text_input/TextInput.svelte';
</script>

<svelte:head>
	<title>typr</title>
</svelte:head>

<section class="text-input">
	<TextInput />
</section>

<style>
	.text-input {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		height: 50vh;
	}
</style>
