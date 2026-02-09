<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let displayName = $state('');

	$effect(() => {
		displayName = data.targetUser.displayName;
	});
</script>

{#if data.isOwnProfile}
	<h1>Edytuj profil</h1>
{:else}
	<h1>Edytuj profil: {data.targetUser.displayName}</h1>
{/if}

<section class="edit-form">
	<form method="POST">
		<div class="form-group">
			<label for="displayName">Nazwa wyświetlana</label>
			<input
				type="text"
				id="displayName"
				name="displayName"
				bind:value={displayName}
				required
				minlength="2"
				maxlength="50"
				placeholder="Twoja nazwa wyświetlana"
			/>
			<span class="help-text">2-50 znaków</span>
		</div>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<div class="button-group">
			<button type="submit">Zapisz zmiany</button>
			<a href="/users/{data.targetUser.id}" class="cancel-link">Anuluj</a>
		</div>
	</form>
</section>

<style>
	h1 {
		margin-bottom: 2rem;
	}

	.edit-form {
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

	.help-text {
		font-size: 0.9rem;
		color: #666;
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
