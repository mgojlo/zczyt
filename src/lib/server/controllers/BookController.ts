import { fail, redirect } from '@sveltejs/kit';
import { BookModel } from '$lib/server/models';
import { canAddBooks, canEditBooks } from '$lib/server/util/roles';
import {
	parseIntParam,
	requireRole,
	requireRoleAction
} from '$lib/server/util/helpers';

export class BookController {
	static async listBooks() {
		const books = await BookModel.listAll();

		return {
			books
		};
	}

	static async loadBook(params: { id?: string }) {
		const bookId = parseIntParam(params.id);
		if (!bookId) throw redirect(303, '/books');

		const book = await BookModel.getById(bookId);
		if (!book) throw redirect(303, '/books');

		return {
			book
		};
	}

	static loadAddBook(locals: App.Locals) {
		requireRole(
			locals,
			canAddBooks,
			'Musisz mieć status zweryfikowanego użytkownika, aby dodawać książki.'
		);
	}

	static async createBook(locals: App.Locals, formData: FormData) {
		const user = requireRoleAction(
			locals,
			canAddBooks,
			'Brak uprawnień do dodawania książek.'
		);

		const title = String(formData.get('title') ?? '').trim();
		const author = String(formData.get('author') ?? '').trim();
		const originalTitle = String(formData.get('originalTitle') ?? '').trim() || null;
		const externalLink = String(formData.get('externalLink') ?? '').trim() || null;

		if (!title || !author) {
			return fail(400, {
				title,
				author,
				originalTitle,
				externalLink,
				error: 'Tytuł i autor są wymagane'
			});
		}

		try {
			await BookModel.create({
				userId: user.id,
				title,
				author,
				originalTitle,
				externalLink
			});
			return { success: true };
		} catch (e) {
			return fail(500, {
				title,
				author,
				originalTitle,
				externalLink,
				error: e instanceof Error ? e.message : 'Unknown error'
			});
		}
	}

	static async loadEditBook(locals: App.Locals, params: { id?: string }) {
		requireRole(
			locals,
			canEditBooks,
			'Musisz mieć status zaufanego użytkownika, aby edytować książki.'
		);

		const bookId = parseIntParam(params.id);
		if (!bookId) throw redirect(303, '/books');

		const book = await BookModel.getById(bookId);
		if (!book) throw redirect(303, '/books');

		return { book };
	}

	static async updateBook(locals: App.Locals, params: { id?: string }, formData: FormData) {
		requireRoleAction(
			locals,
			canEditBooks,
			'Brak uprawnień do edycji książek.'
		);

		const bookId = parseIntParam(params.id);
		if (!bookId) throw fail(400, { error: 'Invalid book ID' });

		const title = String(formData.get('title') ?? '').trim();
		const author = String(formData.get('author') ?? '').trim();
		const originalTitle = String(formData.get('originalTitle') ?? '').trim() || null;
		const externalLink = String(formData.get('externalLink') ?? '').trim() || null;

		if (!title || !author) {
			return fail(400, {
				title,
				author,
				originalTitle,
				externalLink,
				error: 'Tytuł i autor są wymagane'
			});
		}

		try {
			await BookModel.update(bookId, { title, author, originalTitle, externalLink });
		} catch (e) {
			return fail(500, {
				title,
				author,
				originalTitle,
				externalLink,
				error: e instanceof Error ? e.message : 'Unknown error'
			});
		}

		throw redirect(303, `/books/${bookId}`);
	}
}
