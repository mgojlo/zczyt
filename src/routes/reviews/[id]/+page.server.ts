import type { Actions, PageServerLoad } from './$types';
import { ReviewController } from '$lib/server/controllers';

export const load: PageServerLoad = async ({ params }) => {
	return ReviewController.loadReview(params);
};

export const actions = {
	delete: async ({ locals, params }) => {
		return ReviewController.deleteReview(locals, params);
	}
} satisfies Actions;
