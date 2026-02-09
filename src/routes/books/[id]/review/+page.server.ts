import type { Actions } from './$types';
import { ReviewController } from '$lib/server/controllers';

export const load = async ({ locals, params }) => {
    return ReviewController.loadReviewForm(locals, params);
};

export const actions = {
    default: async ({ request, locals, params }) => {
        const formData = await request.formData();
        return ReviewController.submitReview(locals, params, formData);
    }
} satisfies Actions;
