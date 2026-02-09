import type { Actions, PageServerLoad } from './$types';
import { BookController } from '$lib/server/controllers';

export const load: PageServerLoad = async ({ locals, params }) => {
	return BookController.loadEditBook(locals, params);
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		return BookController.updateBook(locals, params, formData);
	}
} satisfies Actions;
