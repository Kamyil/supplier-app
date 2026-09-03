import { dev } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';

type SessionUser = { login: string; name: string; role: string };

export const handle: Handle = async ({ event, resolve }) => {
  const forwardedProtocol = event.request.headers.get('x-forwarded-proto')?.split(',', 1)[0]?.trim();
  if (!dev && (forwardedProtocol ?? event.url.protocol.replace(':', '')) === 'http') {
    const secureUrl = new URL(event.url);
    secureUrl.protocol = 'https:';
    redirect(308, secureUrl);
  }

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
