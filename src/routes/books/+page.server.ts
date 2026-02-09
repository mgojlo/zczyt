import type { PageServerLoad } from './$types';
import { BookController } from '$lib/server/controllers';

export const load: PageServerLoad = async () => {
    return BookController.listBooks();
};
