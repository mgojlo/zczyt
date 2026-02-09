import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { DrizzleQueryError } from 'drizzle-orm';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });

export { schema };
export type User = typeof schema.users.$inferSelect;
export type UserInsert = typeof schema.users.$inferInsert;
export type UserRole = User['role'];

const DbErrorNames = {
    '23505': 'Unique violation'
} as const;

export type DbErrorNames = typeof DbErrorNames;

export type DbErrorCode = keyof DbErrorNames;

export type DbError = DbErrorNames[DbErrorCode] | 'Unknown error';

export function getDbErrorMessage(e: unknown): DbError {
    if (e instanceof DrizzleQueryError) {
        const cause = e.cause;
        if (cause instanceof postgres.PostgresError) {
            const code = cause.code as DbErrorCode;
            if (code in DbErrorNames) {
                return DbErrorNames[code];
            }
        }
    }
    return 'Unknown error' as DbError;
}