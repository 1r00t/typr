<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p />
</footer>

<style>
	main {
		max-width: 65rem;
		padding: 0 3rem;
		margin-left: auto;
		margin-right: auto;
	}
</style>
