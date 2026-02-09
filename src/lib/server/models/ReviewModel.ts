import { db } from '$lib/server/db';
import { reviews, books, users } from '$lib/server/db/schema';
import { eq, desc, and, count, type SQL } from 'drizzle-orm';

export type Review = typeof reviews.$inferSelect;
export type ReviewInsert = typeof reviews.$inferInsert;

export class ReviewModel {
	static async getById(id: number): Promise<Review | null> {
		const [review] = await db
			.select()
			.from(reviews)
			.where(eq(reviews.id, id))
			.limit(1);
		return review ?? null;
	}

	static async getExisting(bookId: number, userId: number): Promise<Review | null> {
		const [review] = await db
			.select()
			.from(reviews)
			.where(and(eq(reviews.bookId, bookId), eq(reviews.userId, userId)))
			.limit(1);
		return review ?? null;
	}

	static async countByUserId(userId: number): Promise<number> {
		const rows = await db
			.select({ count: count() })
			.from(reviews)
			.where(eq(reviews.userId, userId));
		return rows[0]?.count ?? 0;
	}

	static async getWithContext(where?: SQL, limit = 10) {
		const q = db
			.select({
				review: reviews,
				book: books,
				user: {
					id: users.id,
					displayName: users.displayName
				}
			})
			.from(reviews)
			.innerJoin(books, eq(reviews.bookId, books.id))
			.innerJoin(users, eq(reviews.userId, users.id));

		const withWhere = where ? q.where(where) : q;

		return withWhere
			.orderBy(desc(reviews.createdAt))
			.limit(limit);
	}

	static async getByUserId(userId: number) {
		return db
			.select({ review: reviews, book: books })
			.from(reviews)
			.innerJoin(books, eq(reviews.bookId, books.id))
			.where(eq(reviews.userId, userId));
	}

	static async create(data: ReviewInsert) {
		await db.insert(reviews).values(data);
	}

	static async update(
		id: number,
		data: Partial<Pick<Review, 'comment' | 'rating' | 'createdAt'>>
	) {
		await db.update(reviews).set(data).where(eq(reviews.id, id));
	}

	static async delete(id: number) {
		await db.delete(reviews).where(eq(reviews.id, id));
	}
}
