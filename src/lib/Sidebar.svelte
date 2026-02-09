<script lang="ts">
	import { roleLabel } from './roles';

	type User = {
		id: number;
		displayName: string;
		role: string;
	};

	let { user }: { user: User | null } = $props();
</script>

<aside class="sidebar">
	<h2>Menu</h2>
	{#if user}
		<p class="user-name">{user.displayName}</p>
		<p class="user-role role-{user.role}">{roleLabel(user.role)}</p>
	{/if}

	<nav>
		{#if user}
			<a href="/users/{user.id}"> Mój profil </a>
		{/if}
		<a href="/books"> Książki </a>
        <a href="/users"> Użytkownicy </a>
        <a href="/reviews"> Recenzje </a>
	</nav>

	{#if user}
		<form method="POST" action="/logout">
			<button type="submit"> Wyloguj </button>
		</form>
	{:else}
		<nav class="guest-nav">
			<a href="/login"> Zaloguj się </a>
			<a href="/register"> Zarejestruj się </a>
		</nav>
	{/if}
</aside>

<style>
	.sidebar {
		position: sticky;
		left: 0;
		top: 0;
		bottom: 0;
		width: 250px;
		padding: 1.5rem;
		background: #f5f5f5;
		border-right: 1px solid #e0e0e0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
        height: 100vh;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.user-name {
		margin-bottom: 0.25rem;
		padding: 0.5rem;
		background: white;
		border-radius: 4px;
		font-weight: 500;
		text-align: center;
	}

	.user-role {
		text-align: center;
		font-size: 0.8rem;
		padding: 0.2rem 0.5rem;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.role-unverified { background: #e0e0e0; color: #616161; }
	.role-verified { background: #e3f2fd; color: #1565c0; }
	.role-trusted { background: #e8f5e9; color: #2e7d32; }
	.role-moderator { background: #fff3e0; color: #e65100; }
	.role-admin { background: #fce4ec; color: #c62828; }
	.role-site_admin { background: #f3e5f5; color: #6a1b9a; }

	nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.guest-nav {
		margin-top: auto;
	}

	nav a {
		padding: 0.5rem 1rem;
		text-decoration: none;
		color: #333;
		border-radius: 4px;
		transition: background 0.2s;
	}

	nav a:hover {
		background: #e0e0e0;
	}

	form {
		margin-top: auto;
	}

	button {
		width: 100%;
		padding: 0.75rem 1.5rem;
		background: #d32f2f;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #b71c1c;
	}
</style>
