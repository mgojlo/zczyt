<script lang="ts">
	import type { PageData } from './$types';
	import ReviewList from '$lib/ReviewList.svelte';
	import { canRemoveReviews } from '$lib/roles';

	let { data }: { data: PageData } = $props();

	const canModerate = $derived(!!data.user && canRemoveReviews(data.user.role));
</script>

<h1>Najnowsze recenzje</h1>
<ReviewList
	reviews={data.reviews}
	currentUserId={data.user?.id}
	showBookInfo={true}
	showUserInfo={true}
	{canModerate}
/>

<style>
	h1 {
		margin-bottom: 2rem;
	}
</style>
