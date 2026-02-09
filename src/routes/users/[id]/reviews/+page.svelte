<script lang="ts">
	import type { PageData } from './$types';
	import ReviewList from '$lib/ReviewList.svelte';

	let { data }: { data: PageData } = $props();
</script>

<h1>Recenzje użytkownika {data.profileUser.displayName}</h1>

<ReviewList
	reviews={data.reviews}
	currentUserId={data.user?.id}
	editable={data.user?.id === data.profileUser.id}
	showBookInfo={true}
/>

<div class="back-link">
	<a href="/books">← Powrót do książek</a>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	.back-link {
		margin-top: 2rem;
	}

	.back-link a {
		color: #0066cc;
		text-decoration: none;
		transition: color 0.2s;
	}

	.back-link a:hover {
		color: #0052a3;
		text-decoration: underline;
	}
</style>
