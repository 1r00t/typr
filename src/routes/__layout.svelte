<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import Footer from '$lib/Footer/index.svelte';
	import '../app.css';
</script>

<div class="container">
	<Header />

	<main>
		<slot />
	</main>

	<Footer />
</div>

<style>
	.container {
		min-height: 100vh;
		max-width: 40rem;
		/* max-width: 65rem; */
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 3rem;
	}

	main {
		flex: 1;
		margin-top: 3rem;
	}
</style>
