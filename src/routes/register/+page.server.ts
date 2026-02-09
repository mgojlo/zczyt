import type { Actions } from './$types';
import { UserController } from '$lib/server/controllers';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    return UserController.register(formData);
  }
} satisfies Actions;
