<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import BookReview from '$lib/BookReview.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let comment = $state('');
	let rating = $state(5);
	let charCount = $derived(comment.length);

	$effect(() => {
		comment = data.existingReview?.comment || '';
		rating = data.existingReview?.rating || 5;
	});
</script>

<h1>{data.existingReview ? 'Edytuj' : 'Dodaj'} recenzję</h1>

<section class="book-info">
	<h2>{data.book.title}</h2>
	{#if data.book.originalTitle}
		<p class="translation">(Tytuł oryginalny: {data.book.originalTitle})</p>
	{/if}
	<p class="author">by {data.book.author}</p>
</section>

{#if data.existingReview}
	<section class="existing-review">
		<h2>Twoja obecna recenzja</h2>
		<BookReview
			review={data.existingReview}
			book={data.book}
			currentUserId={data.user?.id}
			editable={true}
		/>
	</section>
{/if}

{#if !data.existingReview}
	<section class="review-form">
	<form method="POST">
		<div class="form-group">
			<label for="rating">Ocena (1-10)</label>
			<div class="rating-input">
				<input 
					type="range" 
					id="rating" 
					name="rating" 
					min="1" 
					max="10" 
					bind:value={rating}
					required 
				/>
				<span class="rating-value">{rating}/10</span>
			</div>
		</div>

		<div class="form-group">
			<label for="comment">
				Komentarz (maks. 250 znaków)
				<span class="char-count" class:warning={charCount > 250}>
					{charCount}/250
				</span>
			</label>
			<textarea 
				id="comment" 
				name="comment" 
				bind:value={comment}
				maxlength="250"
				rows="5"
				required
				placeholder="Wpisz swoją recenzję..."
			></textarea>
		</div>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<div class="button-group">
			<button type="submit">Dodaj recenzję</button>
			<a href="/books" class="cancel-link">Anuluj</a>
		</div>
	</form>
</section>
{/if}

<style>
	h1 {
		margin-bottom: 2rem;
	}

	.existing-review h2 {
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.book-info {
		background: #f5f5f5;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}

	.book-info h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
	}

	.translation {
		margin: 0 0 0.5rem 0;
		font-style: italic;
		color: #666;
	}

	.author {
		margin: 0;
		color: #666;
	}

	.review-form {
		max-width: 600px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 500;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.char-count {
		font-size: 0.9rem;
		color: #666;
		font-weight: normal;
	}

	.char-count.warning {
		color: #d32f2f;
	}

	.rating-input {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	input[type="range"] {
		flex: 1;
		height: 6px;
		background: #ddd;
		border-radius: 3px;
		outline: none;
		appearance: none;
		-webkit-appearance: none;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: #0066cc;
		border-radius: 50%;
		cursor: pointer;
	}

	input[type="range"]::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #0066cc;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	.rating-value {
		font-size: 1.25rem;
		font-weight: 600;
		color: #0066cc;
		min-width: 60px;
		text-align: center;
	}

	textarea {
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
	}

	textarea:focus {
		outline: none;
		border-color: #0066cc;
	}

	.error {
		color: #d32f2f;
		margin: 0;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	button {
		padding: 0.75rem 1.5rem;
		background: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #0052a3;
	}

	.cancel-link {
		color: #666;
		text-decoration: none;
		transition: color 0.2s;
	}

	.cancel-link:hover {
		color: #333;
		text-decoration: underline;
	}
</style>
