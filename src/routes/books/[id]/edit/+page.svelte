<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let title = $state('');
	let author = $state('');
	let originalTitle = $state('');
	let externalLink = $state('');

	$effect(() => {
		title = data.book.title;
		author = data.book.author;
		originalTitle = data.book.originalTitle ?? '';
		externalLink = data.book.externalLink ?? '';
	});
</script>

<h1>Edytuj książkę</h1>

<section class="edit-book">
	<form method="POST">
		<div class="form-group">
			<label for="title">Tytuł</label>
			<input
				type="text"
				id="title"
				name="title"
				bind:value={title}
				required
			/>
		</div>

		<div class="form-group">
			<label for="author">Autor</label>
			<input
				type="text"
				id="author"
				name="author"
				bind:value={author}
				required
			/>
		</div>

		<div class="form-group">
			<label for="originalTitle">Tytuł oryginalny</label>
			<input
				type="text"
				id="originalTitle"
				name="originalTitle"
				bind:value={originalTitle}
			/>
		</div>

		<div class="form-group">
			<label for="externalLink">Link zewnętrzny</label>
			<input
				type="url"
				id="externalLink"
				name="externalLink"
				bind:value={externalLink}
				placeholder="https://..."
			/>
		</div>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<div class="button-group">
			<button type="submit">Zapisz zmiany</button>
			<a href="/books/{data.book.id}" class="cancel-link">Anuluj</a>
		</div>
	</form>
</section>

<style>
	h1 {
		margin-bottom: 2rem;
	}

	.edit-book {
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
	}

	input {
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #0066cc;
	}

	.error {
		color: #d32f2f;
		font-weight: 500;
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
	}

	.cancel-link:hover {
		text-decoration: underline;
	}
</style>
