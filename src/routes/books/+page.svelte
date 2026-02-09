<script lang="ts">
	import type { PageData } from './$types';
	import BookList from '$lib/BookList.svelte';
	import { canAddBooks } from '$lib/roles';

	let { data }: { data: PageData } = $props();

	const showAddBook = $derived(!!data.user && canAddBooks(data.user.role));
</script>

<h1>Książki</h1>

{#if showAddBook}
	<a href="/books/add-book" class="add-book-link">Dodaj Nową Książkę</a>
{/if}

<section class="books-list">
	<BookList books={data.books} />
</section>

<style>
	h1 {
		margin-bottom: 2rem;
	}

	.books-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.add-book-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		transition: background 0.2s;
		align-self: flex-start;
	}

	.add-book-link:hover {
		background: #0052a3;
	}
</style>
