import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Hardcoded demo account — makieta, bez prawdziwego backendu.
const accounts = [
  { login: 'admin', password: 'chespa123', name: 'Administrator ST', role: 'Magazynier · M01' }
];

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) redirect(303, '/');
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const login = String(data.get('login') ?? '').trim().toLowerCase();
    const password = String(data.get('password') ?? '');

    const account = accounts.find((item) => item.login === login && item.password === password);
    if (!account) {
      return fail(400, { login, error: 'Nieprawidłowy login lub hasło. Sprawdź dane i spróbuj ponownie.' });
    }

    cookies.set('st_session', btoa(JSON.stringify({ login: account.login, name: account.name, role: account.role })), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60
    });
    redirect(303, '/');
  }
};
