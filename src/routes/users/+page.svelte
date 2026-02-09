<script lang="ts">
	import type { PageData } from './$types';
	import { canPromoteUsers, roleLabel } from '$lib/roles';

	let { data }: { data: PageData } = $props();
</script>

<section class="userlist">
	<h1>Użytkownicy</h1>

	{#if data.users.length === 0}
		<p>Brak użytkowników.</p>
	{:else}
		<ul>
			{#each data.users as user}
				<li class="user-item">
					<div class="user-info">
						<h2>
							<a href="/users/{user.id}">{user.displayName}</a>
						</h2>
						<span class="role-badge role-{user.role}">{roleLabel(user.role)}</span>
						{#if user.id === data.user?.id}
							<span>(Ty)</span>
						{/if}
					</div>
					<div class="user-actions">
						<a href="/users/{user.id}/reviews" class="reviews-link">Recenzje</a>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.role-badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		border-radius: 8px;
		font-size: 0.75rem;
		font-weight: 500;
		vertical-align: middle;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	.user-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid #e0e0e0;
	}

	.user-item a {
		text-decoration: none;
		color: #0066cc;
	}

	.role-unverified { background: #e0e0e0; color: #616161; }
	.role-verified { background: #e3f2fd; color: #1565c0; }
	.role-trusted { background: #e8f5e9; color: #2e7d32; }
	.role-moderator { background: #fff3e0; color: #e65100; }
	.role-admin { background: #fce4ec; color: #c62828; }
	.role-site_admin { background: #f3e5f5; color: #6a1b9a; }
</style>
