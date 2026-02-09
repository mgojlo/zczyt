<script lang="ts">
	import type { PageData } from './$types';
	import BookReview from '$lib/BookReview.svelte';
	import { canRemoveReviews } from '$lib/roles';

	let { data }: { data: PageData } = $props();

	const canModerate = $derived(!!data.user && canRemoveReviews(data.user.role));
</script>

<h1>Recenzja</h1>

<BookReview
	review={data.review}
	book={{
		id: data.book.id,
		title: data.book.title,
		author: data.book.author,
		originalTitle: data.book.originalTitle,
		externalLink: data.book.externalLink
	}}
	user={{
		id: data.reviewUser.id,
		displayName: data.reviewUser.displayName,
	}}
	currentUserId={data.user?.id}
	editable={false}
	showBookInfo={true}
	showUserInfo={true}
/>

{#if canModerate}
	<form method="POST" action="?/delete" class="delete-form" onsubmit={(e) => { if (!confirm('Czy na pewno chcesz usunąć tę recenzję?')) e.preventDefault(); }}>
		<button type="submit" class="delete-btn">Usuń recenzję</button>
	</form>
{/if}

<div class="back-link">
	<a href="/books">← Powrót do książek</a>
</div>

<style>
	h1 {
		margin-bottom: 2rem;
	}

	.delete-form {
		margin-top: 1rem;
	}

	.delete-btn {
		padding: 0.5rem 1rem;
		background: #d32f2f;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.delete-btn:hover {
		background: #b71c1c;
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
