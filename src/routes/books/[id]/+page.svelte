<script lang="ts">
	import Book from '$lib/Book.svelte';
	import ReviewList from '$lib/ReviewList.svelte';
    import type { PageData } from './$types';
	import { canAddReview, canEditBooks, canRemoveReviews } from '$lib/roles';

    let { data }: { data: PageData } = $props();

	const canEdit = $derived(!!data.user && canEditBooks(data.user.role));
	const canModerate = $derived(!!data.user && canRemoveReviews(data.user.role));
	const canReview = $derived(!!data.user && canAddReview(data.user.role));
</script>

<Book
    {...data.book} />

{#if canEdit}
	<div class="book-actions">
		<a href="/books/{data.book.id}/edit" class="edit-link">Edytuj książkę</a>
	</div>
{/if}

{#if canReview}
<div class="book-actions">
	<a href="/books/{data.book.id}/review" class="review-link">Dodaj recenzję</a>
</div>
{/if}

<h2>Recenzje</h2>
<ReviewList
	reviews={data.reviews}
	currentUserId={data.user?.id}
	showUserInfo={true}
	{canModerate}
/>

<style>
	.book-actions {
		margin: 1rem 0;
	}

	.edit-link, .review-link {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	.edit-link:hover {
		background: #0052a3;
	}
</style>