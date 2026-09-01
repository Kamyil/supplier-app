import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies }) => {
    cookies.delete('st_session', { path: '/' });
    redirect(303, '/login');
  }
};
