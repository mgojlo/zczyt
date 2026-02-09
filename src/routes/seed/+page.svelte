<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Seed — Dane testowe</title>
</svelte:head>

<div>
	<h1>Generowanie danych testowych</h1>

	<p>
		Kliknij przycisk, aby wygenerować losowych użytkowników i ich recenzje (z datą sprzed tygodnia).
		Każdy użytkownik loguje się hasłem:
		<code>password123</code>
	</p>

	<form method="POST">
		<button type="submit"> Generuj dane </button>
	</form>

	{#if form?.error}
		<div>
			{form.error}
		</div>
	{/if}

	{#if form?.success}
		<div>
			<p>{form.message}</p>
			{#if form.users && form.users.length > 0}
				<ul>
					{#each form.users as name}
						<li>{name}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>
