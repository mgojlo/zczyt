<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let title = $state('');
	let author = $state('');
	let originalTitle = $state('');
	let externalLink = $state('');

	// Reset form on successful submission
	$effect(() => {
		if (form?.success) {
			title = '';
			author = '';
			originalTitle = '';
			externalLink = '';
		}
	});
</script>

<h1>Dodaj książkę</h1>

<section class="add-book">
	<h2>Dodaj nową książkę</h2>
	
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

		{#if form?.success}
			<p class="success">Książka dodana!</p>
		{/if}

		<button type="submit">Dodaj książkę</button>
	</form>
</section>

<style>
	h1 {
		margin-bottom: 2rem;
	}

	.add-book {
		background: #f5f5f5;
		padding: 1.5rem;
		border-radius: 8px;
	}

	h2 {
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 500px;
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
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #0066cc;
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

	.error {
		color: #d32f2f;
		margin: 0;
	}

	.success {
		color: #388e3c;
		margin: 0;
	}
</style>