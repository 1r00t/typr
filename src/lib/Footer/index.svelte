<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { GithubLogo } from '@steeze-ui/radix-icons';
</script>

<footer>
	<div>
		<span>check out on</span>
		<a href="https://github.com/1r00t/typr/" target="_blank"
			><Icon src={GithubLogo} size="20px" />github</a
		>
	</div>
</footer>

<style>
	footer {
		height: var(--footer-height);
		color: var(--theme-blue-300);
	}

	div {
		display: flex;
		align-items: center;
		justify-content: right;
		gap: 1rem;
	}

	a {
		color: var(--theme-blue-200);
		transition: color 500ms ease;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	a:hover,
	a:focus {
		color: var(--theme-blue-100);
		outline: none;
	}
</style>
