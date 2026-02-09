import type { Handle } from '@sveltejs/kit';
import { UserController } from '$lib/server/controllers';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const sessionData = await UserController.validateSession(sessionId);

	if (!sessionData) {
		event.cookies.delete('session', { path: '/' });
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	event.locals.user = {
		id: sessionData.user.id,
		displayName: sessionData.user.displayName,
		role: sessionData.user.role
	};
	event.locals.session = sessionData.session;

	return resolve(event);
};
