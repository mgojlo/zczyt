<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { canEditProfiles } from '$lib/roles';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const isOwnProfile = $derived(data.user?.id === data.profileUser.id);
	const canEdit = $derived(
		isOwnProfile || (data.user != null && canEditProfiles(data.user.role))
	);
	const canPromote = $derived(
		data.assignableRoles.length > 0 && !isOwnProfile
	);

	let selectedRole = $state('');

	$effect(() => {
		selectedRole = data.profileUser.role;
	});
</script>

<div class="profile-header">
	<h1>{data.profileUser.displayName}</h1>
	<p class="role-badge role-{data.profileUser.role}">{data.roleLabel}</p>
	
	{#if canEdit}
		<a href="/users/{data.profileUser.id}/edit" class="edit-profile-btn">Edytuj profil</a>
	{/if}
</div>

<div class="profile-stats">
	<div class="stat-card">
		<span class="stat-number">{data.reviewCount}</span>
		<span class="stat-label">Recenzji</span>
	</div>
	
	<div class="stat-card">
		<span class="stat-number">{data.bookCount}</span>
		<span class="stat-label">Dodanych książek</span>
	</div>
</div>

{#if canPromote}
	<section class="promote-section">
		<h2>Zmień rolę użytkownika</h2>
		{#if form?.success}
			<p class="success">Rola została zmieniona.</p>
		{/if}
		{#if form && 'error' in form}
			<p class="error">{form.error}</p>
		{/if}
		<form method="POST" action="?/promote">
			<div class="promote-controls">
				<select name="role" bind:value={selectedRole}>
					{#each data.assignableRoles as role}
						<option value={role.value} selected={role.value === data.profileUser.role}>
							{role.label}
						</option>
					{/each}
				</select>
				<button type="submit">Zmień rolę</button>
			</div>
		</form>
	</section>
{/if}

<div class="profile-actions">
	<a href="/users/{data.profileUser.id}/reviews" class="action-link">
		Zobacz wszystkie recenzje →
	</a>
</div>

<style>
	.profile-header {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 2px solid #e0e0e0;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
	}

	.edit-profile-btn {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	.edit-profile-btn:hover {
		background: #0052a3;
	}

	.profile-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: #f5f5f5;
		padding: 2rem;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.stat-number {
		font-size: 2.5rem;
		font-weight: 700;
		color: #0066cc;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		color: #666;
		font-size: 1rem;
	}

	.profile-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.action-link {
		display: inline-block;
		padding: 1rem 1.5rem;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		color: #0066cc;
		text-decoration: none;
		transition: all 0.2s;
		text-align: center;
	}

	.action-link:hover {
		background: #f5f5f5;
		border-color: #0066cc;
	}

	.role-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.role-unverified {
		background: #e0e0e0;
		color: #616161;
	}

	.role-verified {
		background: #e3f2fd;
		color: #1565c0;
	}

	.role-trusted {
		background: #e8f5e9;
		color: #2e7d32;
	}

	.role-moderator {
		background: #fff3e0;
		color: #e65100;
	}

	.role-admin {
		background: #fce4ec;
		color: #c62828;
	}

	.role-site_admin {
		background: #f3e5f5;
		color: #6a1b9a;
	}

	.promote-section {
		margin: 2rem 0;
		padding: 1.5rem;
		background: #f5f5f5;
		border-radius: 8px;
	}

	.promote-section h2 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
	}

	.promote-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.promote-controls select {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		background: white;
	}

	.promote-controls button {
		padding: 0.5rem 1rem;
		background: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.promote-controls button:hover {
		background: #0052a3;
	}

	.success {
		color: #2e7d32;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.error {
		color: #d32f2f;
		font-weight: 500;
		margin-bottom: 1rem;
	}
</style>
