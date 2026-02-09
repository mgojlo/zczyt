<script lang="ts">
    import Book from './Book.svelte';
    import type { BookView, ReviewView, UserSummary } from './types';

	let {
		review,
		book,
		user,
		currentUserId,
		editable = false,
		showBookInfo = false,
		showUserInfo = false
	}: {
		review: ReviewView;
		book: BookView;
		user?: UserSummary;
		currentUserId?: number;
		editable?: boolean;
		showBookInfo?: boolean;
		showUserInfo?: boolean;
	} = $props();

	let isEditing = $state(false);
	let comment = $state('');
	let rating = $state(0);
	let charCount = $derived(comment.length);

	$effect(() => {
		if (!isEditing) {
			comment = review.comment;
			rating = review.rating;
		}
	});

	const canEdit = $derived(currentUserId === review.userId && editable);

	function startEdit() {
		isEditing = true;
		comment = review.comment;
		rating = review.rating;
	}

	function cancelEdit() {
		isEditing = false;
		comment = review.comment;
		rating = review.rating;
	}
</script>
<div class="review-container">
	{#if showBookInfo && book}
		<Book
			id={book.id}
			title={book.title}
			author={book.author}
			originalTitle={book.originalTitle ?? null}
			externalLink={book.externalLink ?? null}/>
	{/if}

	{#if showUserInfo && user}
		<div class="user-header">
			<p class="user-name">
				<strong>{user.displayName}</strong>
			</p>
		</div>
	{/if}

	{#if isEditing}
		<form method="POST" class="edit-form">
			<div class="form-group">
				<label for="rating-{review.id}">Ocena (1-10)</label>
				<div class="rating-input">
					<input
						type="range"
						id="rating-{review.id}"
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
				<label for="comment-{review.id}">
					Komentarz (maks. 250 znaków)
					<span class="char-count" class:warning={charCount > 250}> {charCount}/250 </span>
				</label>
				<textarea
					id="comment-{review.id}"
					name="comment"
					bind:value={comment}
					maxlength="250"
					rows="5"
					required
					placeholder="Wpisz swoją recenzję..."
				></textarea>
			</div>

			<div class="button-group">
				<button type="submit">Zapisz</button>
				<button type="button" class="cancel-btn" onclick={cancelEdit}>Anuluj</button>
			</div>
		</form>
	{:else}
		<div class="review-display">
			<div class="rating-display">
				<span class="rating-badge">{review.rating}/10</span>
				<time class="date" datetime="{review.createdAt.toISOString()}">
					{new Date(review.createdAt).toLocaleDateString('pl-PL')}
                </time>
			</div>
			<p class="comment">{review.comment}</p>
			{#if canEdit}
				<button type="button" class="edit-btn" onclick={startEdit}>Edytuj recenzję</button>
			{/if}
		</div>
	{/if}
    </div>

<style>
	.review-container {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		overflow-wrap: break-word;
		word-wrap: break-word;
		word-break: break-word;
		max-width: 100%;
	}

	.user-header {
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e0e0e0;
	}

	.user-name {
		margin: 0;
		color: #333;
	}

	.review-display {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.rating-display {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.rating-badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: #0066cc;
		color: white;
		border-radius: 4px;
		font-weight: 600;
		font-size: 1.1rem;
	}

	.date {
		color: #666;
		font-size: 0.9rem;
	}

	.comment {
		margin: 0;
		line-height: 1.6;
		color: #333;
        overflow-wrap: break-word;
	}

	.edit-btn {
		align-self: flex-start;
		padding: 0.5rem 1rem;
		background: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.edit-btn:hover {
		background: #0052a3;
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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

	input[type='range'] {
		flex: 1;
		height: 6px;
		background: #ddd;
		border-radius: 3px;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: #0066cc;
		border-radius: 50%;
		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
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

	.button-group {
		display: flex;
		gap: 1rem;
	}

	button[type='submit'] {
		padding: 0.75rem 1.5rem;
		background: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	button[type='submit']:hover {
		background: #0052a3;
	}

	.cancel-btn {
		padding: 0.75rem 1.5rem;
		background: #666;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.cancel-btn:hover {
		background: #555;
	}
</style>
