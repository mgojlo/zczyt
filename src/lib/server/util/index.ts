import { db, getDbErrorMessage, schema, type UserInsert } from '$lib/server/db';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { randomBytes, verify } from 'crypto';
import { validateDisplayName, validateUserName } from './helpers';

async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, { type: argon2.argon2id });
}

function generateSessionId(): string {
    return randomBytes(32).toString('hex');
}

export async function createUser(data: UserInsert) {
    const { username, displayName, password } = data;
    let hashedPassword: string;
    try {
        hashedPassword = await hashPassword(password);
    } catch (e) {
        throw new Error('Hashing failure');
    }

    let err = verifyUserData(username, displayName, password);
    if (err) {
        throw new Error(err);
    }

    try {
        await db.insert(schema.users).values({ username, displayName, password: hashedPassword });
    } catch (err: any) {
        const dbErrorMessage = getDbErrorMessage(err);
        if (dbErrorMessage === 'Unique violation') {
            throw new Error('Username already exists');
        }
        throw new Error('Unknown error');
    }
}

export function validatePassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
}

export async function createSession(userId: number): Promise<string> {
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    await db.insert(schema.sessions).values({
        id: sessionId,
        userId,
        expiresAt
    });

    return sessionId;
}

export async function validateSession(sessionId: string) {
    const result = await db
        .select({
            user: schema.users,
            session: schema.sessions
        })
        .from(schema.sessions)
        .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
        .where(eq(schema.sessions.id, sessionId))
        .limit(1);

    if (result.length === 0) {
        return null;
    }

    const { user, session } = result[0];

    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
        return null;
    }

    return { user, session };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
}

export async function getUserByUsername(username: string) {
    const result = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.username, username))
        .limit(1);

    return result[0] ?? null;
}

function validatePasswordStrength(password: string): string | null {
    if (password.length < 8) {
        return 'Hasło musi mieć co najmniej 8 znaków';
    }
    return null;
}

function verifyUserData(username: string, displayName: string, password: string) {
    return validateDisplayName(displayName) || validateUserName(username) || validatePasswordStrength(password);
}
