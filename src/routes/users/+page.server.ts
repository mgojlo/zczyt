import { canPromoteUsers } from '$lib/roles';
import { UserController } from '$lib/server/controllers';

export async function load({ locals }) {
    const minDisplayRole = canPromoteUsers(locals.user?.role ?? 'unverified') ? 'unverified' : 'verified';
    return UserController.listUsers(minDisplayRole);
}