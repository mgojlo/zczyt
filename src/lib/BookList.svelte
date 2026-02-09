<script lang="ts">
	import Book from './Book.svelte';
	import type { BookView } from './types';

	let { books }: { books: BookView[] } = $props();
</script>

<div class="books-list">
	{#if books.length === 0}
		<p>Brak dodanych książek.</p>
	{:else}
		<ul>
			{#each books as book (book.id)}
				<li>
					<Book 
						id={book.id}
						title={book.title}
						author={book.author}
						originalTitle={book.originalTitle}
						externalLink={book.externalLink}
					/>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.books-list ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.books-list li {
		display: block;
	}

	.books-list p {
		color: #666;
		font-style: italic;
	}
</style>
