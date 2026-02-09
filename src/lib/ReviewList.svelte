<script lang="ts">
	import BookReview from './BookReview.svelte';
	import type { ReviewWithBook, ReviewWithContext } from './types';

	let {
		reviews,
		currentUserId,
		editable = false,
		showBookInfo = false,
		showUserInfo = false,
		canModerate = false
	}: {
		reviews: ReviewWithBook[] | ReviewWithContext[];
		currentUserId?: number;
		editable?: boolean;
		showBookInfo?: boolean;
		showUserInfo?: boolean;
		canModerate?: boolean;
	} = $props();
</script>

{#if reviews.length === 0}
	<p class="empty">Brak recenzji.</p>
{:else}
	<div class="reviews-list">
		{#each reviews as entry (entry.review.id)}
			<div class="review-entry">
				<BookReview
					review={entry.review}
					book={entry.book}
					user={'user' in entry ? entry.user : undefined}
					{currentUserId}
					{editable}
					{showBookInfo}
					showUserInfo={showUserInfo && 'user' in entry}
				/>
				{#if canModerate}
					<form
						method="POST"
						action="/reviews/{entry.review.id}?/delete"
						class="delete-review-form"
						onsubmit={(e) => { if (!confirm('Czy na pewno chcesz usunąć tę recenzję?')) e.preventDefault(); }}
					>
						<button type="submit" class="delete-btn">Usuń recenzję</button>
					</form>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style>
	.empty {
		color: #666;
		font-style: italic;
		padding: 2rem;
		background: #f5f5f5;
		border-radius: 8px;
		text-align: center;
	}

	.reviews-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.delete-review-form {
		margin-top: -0.5rem;
		margin-bottom: 0.5rem;
	}

	.delete-btn {
		padding: 0.4rem 0.8rem;
		background: #d32f2f;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.85rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.delete-btn:hover {
		background: #b71c1c;
	}
</style>
