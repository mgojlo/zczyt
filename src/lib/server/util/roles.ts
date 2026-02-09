import type { UserRole } from '$lib/server/db';

const ROLE_LEVELS: Record<UserRole, number> = {
	unverified: 0,
	verified: 1,
	trusted: 2,
	moderator: 3,
	admin: 4,
	site_admin: 5
};

export const ROLE_LABELS: Record<UserRole, string> = {
	unverified: 'Niezweryfikowany',
	verified: 'Zweryfikowany',
	trusted: 'Zaufany',
	moderator: 'Moderator',
	admin: 'Administrator',
	site_admin: 'Administrator serwisu'
};

export const ALL_ROLES: UserRole[] = [
	'unverified',
	'verified',
	'trusted',
	'moderator',
	'admin',
	'site_admin'
];

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
	return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

export function getRoleLevel(role: UserRole): number {
	return ROLE_LEVELS[role];
}

export function canAddBooks(role: UserRole): boolean {
	return hasRole(role, 'verified');
}

export function canEditBooks(role: UserRole): boolean {
	return hasRole(role, 'trusted');
}

export function canRemoveReviews(role: UserRole): boolean {
	return hasRole(role, 'moderator');
}

export function canEditProfiles(role: UserRole): boolean {
	return hasRole(role, 'moderator');
}

export function canPromoteUsers(role: UserRole): boolean {
	return hasRole(role, 'admin');
}

export function getAssignableRoles(promoterRole: UserRole): UserRole[] {
	if (promoterRole === 'site_admin') {
		return ['unverified', 'verified', 'trusted', 'moderator', 'admin'];
	}
	if (promoterRole === 'admin') {
		return ['unverified', 'verified', 'trusted', 'moderator'];
	}
	return [];
}

export function canAssignRole(promoterRole: UserRole, targetRole: UserRole): boolean {
	const assignable = getAssignableRoles(promoterRole);
	return assignable.includes(targetRole);
}

export function isValidRole(role: string): role is UserRole {
	return role in ROLE_LEVELS;
}
