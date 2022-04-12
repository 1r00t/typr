<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { TextAlignRight } from '@steeze-ui/radix-icons';
</script>

<header>
	<h1>
		<Icon src={TextAlignRight} size="0.75em" /><span>typr</span>
	</h1>
</header>

<style>
	header {
		height: var(--header-height);
		display: flex;
		align-items: center;
	}
	h1 {
		font-size: 3rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		padding: 0;
		margin: 0;
	}
</style>
