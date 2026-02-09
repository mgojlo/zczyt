import { fail, redirect, error, isActionFailure } from '@sveltejs/kit';
import type { UserRole } from '$lib/server/db';

export function parseIntParam(value: string | undefined): number | null {
	if (value === undefined) return null;
	const n = parseInt(value, 10);
	return Number.isNaN(n) ? null : n;
}

type Locals = App.Locals;

export function requireAuth(locals: Locals) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	return locals.user;
}

export function requireAuthAction(locals: Locals) {
	if (!locals.user) {
		throw fail(401, { error: 'Unauthorized' });
	}
	return locals.user;
}

export function requireRole(
	locals: Locals,
	check: (role: UserRole) => boolean,
	message: string
) {
	const user = requireAuth(locals);
	if (!check(user.role)) {
		throw error(403, message);
	}
	return user;
}

export function requireRoleAction(
	locals: Locals,
	check: (role: UserRole) => boolean,
	message: string
) {
	const user = requireAuthAction(locals);

	if (!check(user.role)) {
		throw fail(403, { error: message });
	}
	return user;
}

export function validateDisplayName(displayName: string): string | null {
	if (!displayName) return 'Nazwa wyświetlana jest wymagana.';
	if (displayName.length < 2) return 'Nazwa wyświetlana musi mieć co najmniej 2 znaki.';
	if (displayName.length > 50) return 'Nazwa wyświetlana może mieć maksymalnie 50 znaków.';
	return null;
}

export function validateUserName(username: string): string | null {
    if (!username) return 'Nazwa użytkownika jest wymagana.';
    if (username.length < 3) return 'Nazwa użytkownika musi mieć co najmniej 3 znaki.';
    if (username.length > 30) return 'Nazwa użytkownika może mieć maksymalnie 30 znaków.';
    if (/ /.test(username)) return 'Nazwa użytkownika nie może zawierać spacji.';
    return null;
}