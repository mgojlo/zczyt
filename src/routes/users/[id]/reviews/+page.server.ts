import type { PageServerLoad } from './$types';
import { ReviewController } from '$lib/server/controllers';

export const load: PageServerLoad = async ({ params }) => {
	return ReviewController.listByUser(params);
};
