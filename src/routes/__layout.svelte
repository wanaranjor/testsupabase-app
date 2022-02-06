<script>
	import { session } from '$app/stores';
	import Header from '$lib/Header/index.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { setAuthCookie, unsetAuthCookie } from '$lib/utils/session';
	import '../app.css';

	supabase.auth.onAuthStateChange(async (event, _session) => {
		if (event !== 'SIGNED_OUT') {
			session.set({ user: _session.user });
			await setAuthCookie(_session);
		} else {
			session.set({ user: { guest: true } });
			await unsetAuthCookie();
		}
	});
</script>

<Header />
<main class="container mx-auto">
	<slot />
</main>

<footer class="container mx-auto">
	<p>
		visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
	</p>
	<h2>Session Data</h2>
	<pre>{JSON.stringify($session, null, 2)}</pre>
</footer>
