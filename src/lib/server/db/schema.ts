import { sql} from 'drizzle-orm';
import { pgTable, pgEnum, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
	'unverified',
	'verified',
	'trusted',
	'moderator',
	'admin',
	'site_admin'
]);

export const users = pgTable('users', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	username: text('username').unique().notNull(),
	displayName: text('display_name').notNull(),
	password: text('password').notNull(),
	role: userRoleEnum('role').notNull().default('unverified')
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

export const books = pgTable('books', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
	title: text('title').notNull(),
	author: text('author').notNull(),
	originalTitle: text('original_title'),
	externalLink: text('external_link'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const reviews = pgTable('reviews', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
	userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'set null' }),
	comment: text('comment').notNull(),
	rating: integer('rating').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// export const usersRelations = relations(users, ({ many }) => ({
// 	books: many(books),
// 	reviews: many(reviews),
// 	sessions: many(sessions)
// }));

// export const booksRelations = relations(books, ({ one, many }) => ({
// 	user: one(users, {
// 		fields: [books.userId],
// 		references: [users.id]
// 	}),
// 	reviews: many(reviews)
// }));

// export const reviewsRelations = relations(reviews, ({ one }) => ({
// 	book: one(books, {
// 		fields: [reviews.bookId],
// 		references: [books.id]
// 	}),
// 	user: one(users, {
// 		fields: [reviews.userId],
// 		references: [users.id]
// 	})
// }));