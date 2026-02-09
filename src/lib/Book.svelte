<script lang="ts">
	import type { BookView } from './types';

	let { id, title, author, originalTitle, externalLink }: BookView = $props();
</script>

<div class="book-item">
	<div class="book-info">
		<h3><a href="/books/{id}">{title}</a></h3>
		{#if originalTitle}
			<p class="translation">(Tytuł oryginalny: {originalTitle})</p>
		{/if}
		<p class="author">{author}</p>
		{#if externalLink}
			<a href={externalLink} target="_blank" rel="noopener noreferrer">
				{externalLink}
			</a>
		{/if}
	</div>
</div>

<style>
	.book-item {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		transition: box-shadow 0.2s;
	}

	.book-item:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.book-info h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		color: #333;
	}

	.translation {
		margin: 0 0 0.5rem 0;
		font-style: italic;
		color: #666;
	}

	.author {
		margin: 0 0 0.5rem 0;
		color: #666;
	}

	.book-info a {
		color: #0066cc;
		text-decoration: none;
		font-size: 0.9rem;
		word-break: break-all;
	}

	.book-info a:hover {
		text-decoration: underline;
	}
</style>
