import { fail, redirect, error } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { UserModel, type UserInsert } from '$lib/server/models';
import { getDbErrorMessage } from '$lib/server/db';
import {
	canPromoteUsers,
	canAssignRole,
	canEditProfiles,
	isValidRole,
	getAssignableRoles,
	ROLE_LABELS
} from '$lib/server/util/roles';
import {
	parseIntParam,
	requireAuth,
	requireAuthAction,
	validateDisplayName,
	validateUserName
} from '$lib/server/util/helpers';
import type { UserRole } from '$lib/server/db';

async function hashPassword(password: string): Promise<string> {
	return argon2.hash(password, { type: argon2.argon2id });
}

function generateSessionId(): string {
	return randomBytes(32).toString('hex');
}

function validatePasswordStrength(password: string): string | null {
	if (password.length < 8) return 'Hasło musi mieć co najmniej 8 znaków';
	return null;
}

function verifyUserData(username: string, displayName: string, password: string) {
	return (
		validateDisplayName(displayName) ||
		validateUserName(username) ||
		validatePasswordStrength(password)
	);
}

export class UserController {
	static async register(formData: FormData) {
		const username = String(formData.get('username') ?? '').trim();
		const displayName = String(formData.get('displayName') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!username || !displayName || !password) {
			return fail(400, { username, displayName, error: 'Brak wymaganych pól' });
		}

		const validationError = verifyUserData(username, displayName, password);
		if (validationError) {
			return fail(400, { username, displayName, error: validationError });
		}

		let hashedPassword: string;
		try {
			hashedPassword = await hashPassword(password);
		} catch {
			console.error(`Error hashing password for user ${username} during registration`);
			return fail(500, { username, displayName, error: 'Błąd. Skontaktuj się z administratorem.' });
		}

		try {
			await UserModel.create({ username, displayName, password: hashedPassword });
		} catch (err) {
			const dbErrorMessage = getDbErrorMessage(err);
			if (dbErrorMessage === 'Unique violation') {
				return fail(400, { username, displayName, error: 'Przepraszamy, ta nazwa użytkownika jest niedostępna.' });
			}
			return fail(500, { username, displayName, error: 'Nieznany błąd. Skontaktuj się z administratorem.' });
		}

		throw redirect(303, '/login');
	}

		static async login(formData: FormData, cookies: App.Platform extends undefined ? any : any) {
		const username = String(formData.get('username') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!username || !password) {
			return fail(400, { username, error: 'Brak wymaganych pól' });
		}

		const user = await UserModel.getByUsername(username);
		if (!user) {
			return fail(400, { username, error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
		}

		const validPassword = await argon2.verify(user.password, password);
		if (!validPassword) {
			return fail(400, { username, error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
		}

		const sessionId = generateSessionId();
		const expiryDuration = 60 * 60 * 24 * 30; // 30 dni
		const expiresAt = new Date(Date.now() + expiryDuration * 1000); // 30 dni
		await UserModel.createSession(user.id, sessionId, expiresAt);

		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: expiryDuration
		});

		throw redirect(303, '/');
	}

	static async logout(
		locals: App.Locals,
		cookies: App.Platform extends undefined ? any : any
	) {
		if (locals.session) {
			await UserModel.invalidateSession(locals.session.id);
		}
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/');
	}

	static async validateSession(sessionId: string) {
		return UserModel.validateSession(sessionId);
	}

	static async loadProfile(locals: App.Locals, params: { id?: string }) {
		const userId = parseIntParam(params.id);
		if (!userId) throw redirect(303, '/books');

		const user = await UserModel.getById(userId);
		if (!user) throw redirect(303, '/books');

		const { BookModel, ReviewModel } = await import('$lib/server/models');
		const [reviewCount, bookCount] = await Promise.all([
			ReviewModel.countByUserId(userId),
			BookModel.countByUserId(userId)
		]);

		const assignableRoles =
			locals.user && canPromoteUsers(locals.user.role)
				? getAssignableRoles(locals.user.role).map((r) => ({
						value: r,
						label: ROLE_LABELS[r]
					}))
				: [];

		return {
			profileUser: user,
			reviewCount,
			bookCount,
			roleLabel: ROLE_LABELS[user.role],
			assignableRoles
		};
	}

	static async loadEditProfile(locals: App.Locals, params: { id?: string }) {
		const user = requireAuth(locals);

		const userId = parseIntParam(params.id);
		if (!userId) throw redirect(303, '/users');

		const isOwnProfile = user.id === userId;
		if (!isOwnProfile && !canEditProfiles(user.role)) {
			throw redirect(303, `/users/${userId}`);
		}

		const targetUser = await UserModel.getSummaryById(userId);
		if (!targetUser) throw redirect(303, '/users');

		return { targetUser, isOwnProfile };
	}

	static async updateProfile(locals: App.Locals, params: { id?: string }, formData: FormData) {
		const user = requireAuthAction(locals);

		const userId = parseIntParam(params.id);
		if (!userId) throw fail(400, { error: 'Nieprawidłowe ID użytkownika' });

		const isOwnProfile = user.id === userId;
		if (!isOwnProfile && !canEditProfiles(user.role)) {
			throw fail(403, { error: 'Brak uprawnień do edycji tego profilu.' });
		}

		const displayName = String(formData.get('displayName') ?? '').trim();
		const validationError = validateDisplayName(displayName);
		if (validationError) return fail(400, { displayName, error: validationError });

		const targetUser = await UserModel.getSummaryById(userId);
		if (!targetUser) return fail(404, { displayName, error: 'Użytkownik nie został znaleziony.' });

		try {
			await UserModel.updateDisplayName(userId, displayName);
		} catch (e) {
			return fail(500, {
				displayName,
				error: e instanceof Error ? e.message : 'Unknown error'
			});
		}

		throw redirect(303, `/users/${userId}`);
	}

	// ── Role management ─────────────────────────────────────────

	static async promoteUser(locals: App.Locals, params: { id?: string }, formData: FormData) {
		const user = requireAuthAction(locals);

		if (!canPromoteUsers(user.role)) {
			return fail(403, { error: 'Brak uprawnień do zmiany ról użytkowników.' });
		}

		const userId = parseIntParam(params.id);
		if (!userId) throw fail(400, { error: 'Nieprawidłowe ID użytkownika' });

		if (userId === user.id) {
			return fail(400, { error: 'Nie możesz zmienić swojej własnej roli.' });
		}

		const newRole = String(formData.get('role') ?? '');
		if (!isValidRole(newRole)) {
			return fail(400, { error: 'Nieprawidłowa rola.' });
		}

		if (!canAssignRole(user.role, newRole)) {
			return fail(403, { error: 'Nie masz uprawnień do przypisania tej roli.' });
		}

		const targetUser = await UserModel.getById(userId);
		if (!targetUser) {
			return fail(404, { error: 'Użytkownik nie został znaleziony.' });
		}

		if (!canAssignRole(user.role, targetUser.role) && user.role !== 'site_admin') {
			return fail(403, { error: 'Nie możesz zmienić roli tego użytkownika.' });
		}

		await UserModel.updateRole(userId, newRole as UserRole);

		return { success: true, promotedTo: newRole };
	}

	static async listUsers(minimumRole: UserRole = 'verified') {
		const userList = await UserModel.listAll(minimumRole);

		return {
			users: userList
		};
	}
}
