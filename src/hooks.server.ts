import { redirect, type Handle } from '@sveltejs/kit';

type SessionUser = { login: string; name: string; role: string };

export const handle: Handle = async ({ event, resolve }) => {
  const raw = event.cookies.get('st_session');
  let user: SessionUser | null = null;
  if (raw) {
    try {
      user = JSON.parse(atob(raw)) as SessionUser;
    } catch {
      user = null;
    }
  }
  event.locals.user = user;

  const routeId = event.route.id ?? '';
  const isPublic = routeId === '/login' || routeId === '/logout';
  if (routeId && !isPublic && !event.locals.user) redirect(303, '/login');
  if (routeId === '/login' && event.locals.user) redirect(303, '/');

  return resolve(event);
};
