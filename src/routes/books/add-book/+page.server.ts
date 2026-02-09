import type { Actions } from './$types';
import { BookController } from '$lib/server/controllers';

export function load({ locals }) {
	BookController.loadAddBook(locals);
}

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		return BookController.createBook(locals, formData);
	}
} satisfies Actions;
