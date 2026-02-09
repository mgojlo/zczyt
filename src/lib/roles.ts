export type UserRole =
	| 'unverified'
	| 'verified'
	| 'trusted'
	| 'moderator'
	| 'admin'
	| 'site_admin';

export const ROLE_LABELS: Record<UserRole, string> = {
	unverified: 'Niezweryfikowany',
	verified: 'Zweryfikowany',
	trusted: 'Zaufany',
	moderator: 'Moderator',
	admin: 'Administrator',
	site_admin: 'Administrator serwisu'
};

const ROLE_LEVELS: Record<UserRole, number> = {
	unverified: 0,
	verified: 1,
	trusted: 2,
	moderator: 3,
	admin: 4,
	site_admin: 5
};

function hasRole(role: UserRole, required: UserRole): boolean {
	return ROLE_LEVELS[role] >= ROLE_LEVELS[required];
}

export function canAddReview(role: UserRole): boolean {
	return hasRole(role, 'verified');
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

export function roleLabel(role: string): string {
	return ROLE_LABELS[role as UserRole] ?? role;
}
