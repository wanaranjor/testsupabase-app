import { auth, supabase } from '$lib/supabaseClient';
import { toExpressRequest, toExpressResponse, toSvelteKitResponse } from '$lib/utils/expressify';

export const handle = async ({ event, resolve }) => {
  // Converts request to have `req.headers.cookie` on `req.cookies, as `getUserByCookie` expects parsed cookies on `req.cookies`
  const expressStyleRequest = toExpressRequest(event);
  const { user } = await auth.api.getUserByCookie(expressStyleRequest);

  event.locals.token = expressStyleRequest.cookies['sb:token'] || undefined;
  event.locals.user = user || { guest: true };

  // if we have a token, set the client to use it so we can make authorized requests to Supabase
  if (event.locals.token) {
    supabase.auth.setAuth(event.locals.token);
  }

  // TODO https://github.com/sveltejs/kit/issues/1046
  if (event.url.searchParams.has('_method')) {
    event.request.method = event.url.searchParams.get('_method').toUpperCase();
  }

  let response = await resolve(event);


  // if auth request - set cookie in response headers
  if (event.request.method === 'POST' && event.url.pathname === '/api/auth.json') {
    console.log(event.request.method);
    auth.api.setAuthCookie(event, toExpressResponse(response));
    response = toSvelteKitResponse(response);
  }

  return response;
};

export async function getSession(event) {
  const { user, token } = event.locals;
  return {
    user,
    token
  };
}
