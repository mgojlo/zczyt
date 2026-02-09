import type { Actions } from './$types';
import { UserController } from '$lib/server/controllers';

export const actions = {
	default: async ({ locals, cookies }) => {
		return UserController.logout(locals, cookies);
	},
} satisfies Actions;
