import type { Actions, PageServerLoad } from './$types';
import { UserController } from '$lib/server/controllers';

export const load: PageServerLoad = async ({ locals, params }) => {
	return UserController.loadProfile(locals, params);
};

export const actions = {
	promote: async ({ request, locals, params }) => {
		const formData = await request.formData();
		return UserController.promoteUser(locals, params, formData);
	}
} satisfies Actions;
