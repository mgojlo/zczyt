import type { UserRole } from '$lib/roles';
import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import { eq, gte } from 'drizzle-orm';

const userSummaryColumns = {
	id: users.id,
	displayName: users.displayName
} as const;

const userProfileColumns = {
	...userSummaryColumns,
	role: users.role
} as const;

export type UserSummary = {
	[K in keyof typeof userSummaryColumns]: (typeof userSummaryColumns)[K]['_']['data'];
};

export type UserProfile = {
	[K in keyof typeof userProfileColumns]: (typeof userProfileColumns)[K]['_']['data'];
};

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export class UserModel {

	static async getById(id: number): Promise<UserProfile | null> {
		const [user] = await db
			.select(userProfileColumns)
			.from(users)
			.where(eq(users.id, id))
			.limit(1);
		return user ?? null;
	}

	static async getSummaryById(id: number): Promise<UserSummary | null> {
		const [user] = await db
			.select(userSummaryColumns)
			.from(users)
			.where(eq(users.id, id))
			.limit(1);
		return user ?? null;
	}

	static async getByUsername(username: string): Promise<User | null> {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1);
		return user ?? null;
	}

	static async listAll(minimumRole: UserRole = 'verified', limit = 50) {
		return db
			.select(userProfileColumns)
			.from(users)
			.where(gte(users.role, minimumRole))
			.limit(limit);
	}

	static async create(data: UserInsert) {
		await db.insert(users).values(data);
	}

	static async updateDisplayName(id: number, displayName: string) {
		await db.update(users).set({ displayName }).where(eq(users.id, id));
	}

	static async updateRole(id: number, role: User['role']) {
		await db.update(users).set({ role }).where(eq(users.id, id));
	}

	static async createSession(userId: number, sessionId: string, expiresAt: Date) {
		await db.insert(sessions).values({ id: sessionId, userId, expiresAt });
	}

	static async validateSession(sessionId: string) {
		const result = await db
			.select({ user: users, session: sessions })
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(eq(sessions.id, sessionId))
			.limit(1);

		if (result.length === 0) return null;

		const { user, session } = result[0];

		if (Date.now() >= session.expiresAt.getTime()) {
			await db.delete(sessions).where(eq(sessions.id, sessionId));
			return null;
		}

		return { user, session };
	}

	static async invalidateSession(sessionId: string) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
	}
}
