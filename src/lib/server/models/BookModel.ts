import { db } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';

export type Book = typeof books.$inferSelect;
export type BookInsert = typeof books.$inferInsert;

const bookViewColumns = {
	id: books.id,
	title: books.title,
	author: books.author,
	originalTitle: books.originalTitle,
	externalLink: books.externalLink
} as const;

export type BookView = {
	id: number;
	title: string;
	author: string;
	originalTitle: string | null;
	externalLink: string | null;
};

export class BookModel {
	static async getById(id: number): Promise<Book | null> {
		const [book] = await db
			.select()
			.from(books)
			.where(eq(books.id, id))
			.limit(1);
		return book ?? null;
	}

	static async getViewById(id: number): Promise<BookView | null> {
		const [book] = await db
			.select(bookViewColumns)
			.from(books)
			.where(eq(books.id, id))
			.limit(1);
		return (book as BookView) ?? null;
	}

	static async listAll(limit = 10): Promise<BookView[]> {
		const rows = await db.select(bookViewColumns).from(books).limit(limit);
		return rows as BookView[];
	}

	static async listByUserId(userId: number): Promise<BookView[]> {
		const rows = await db.select(bookViewColumns).from(books).where(eq(books.userId, userId));
		return rows as BookView[];
	}

	static async countByUserId(userId: number): Promise<number> {
		const rows = await db
			.select({ count: count() })
			.from(books)
			.where(eq(books.userId, userId));
		return rows[0]?.count ?? 0;
	}

	static async create(data: BookInsert) {
		await db.insert(books).values(data);
	}

	static async update(
		id: number,
		data: Partial<Pick<Book, 'title' | 'author' | 'originalTitle' | 'externalLink'>>
	) {
		await db.update(books).set(data).where(eq(books.id, id));
	}
}
