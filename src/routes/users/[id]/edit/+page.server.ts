import type { Actions, PageServerLoad } from './$types';
import { UserController } from '$lib/server/controllers';

export const load: PageServerLoad = async ({ locals, params }) => {
	return UserController.loadEditProfile(locals, params);
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		return UserController.updateProfile(locals, params, formData);
	}
} satisfies Actions;
