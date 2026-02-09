import { BookController } from '$lib/server/controllers';

export const load = async ({ params }) => {
    return BookController.loadBook(params);
};