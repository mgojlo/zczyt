<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h2>Sign in to your account</h2>

{#if form?.error}
	<h3>{form.error}</h3>
{/if}

<form method="POST" action="/login">
	<label for="username">Username</label>
	<input
		id="username"
		name="username"
		type="text"
		required
		placeholder="Username"
		value={form?.username ?? ''}
	/>
	<label for="password">Password</label>
	<input id="password" name="password" type="password" required placeholder="Password" />

	<button type="submit"> Sign in </button>
</form>

<style>
	h2 {
		margin-bottom: 1.5rem;
	}

	h3 {
		color: #d32f2f;
		margin-bottom: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
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
		margin-top: 0.5rem;
	}

	button:hover {
		background: #0052a3;
	}
</style>
