<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/Sidebar.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="app-container">
	<Sidebar user={data.user} />
	
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app-container {
		display: flex;
		min-height: 100vh;
	}

	main {
		padding: 2rem;
		flex: 1;
		width: 100%;
		box-sizing: border-box;
	}
</style>
