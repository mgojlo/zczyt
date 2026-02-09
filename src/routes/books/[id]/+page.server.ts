import { ReviewController } from '$lib/server/controllers';

export const load = async ({ params }) => {
    return ReviewController.listByBook(params);
};