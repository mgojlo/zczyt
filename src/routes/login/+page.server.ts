import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { UserController } from '$lib/server/controllers';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/');
	}
	return {};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		return UserController.login(formData, cookies);
	}
} satisfies Actions;
