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

<Header>
	<main>
		<slot />
	</main>

	<footer>
		<p>
			visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
		</p>
		<h2>Session Data</h2>
		<pre>{JSON.stringify($session, null, 2)}</pre>
	</footer>

	<style>
		main {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 1rem;
			width: 100%;
			max-width: 1024px;
			margin: 0 auto;
			box-sizing: border-box;
		}

		footer {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 40px;
		}

		footer a {
			font-weight: bold;
		}

		footer pre {
			max-width: 1024px;
			word-wrap: break-word;
			white-space: pre-wrap;
		}

		@media (min-width: 480px) {
			footer {
				padding: 40px 0;
			}
		}
	</style>
</Header>
<slot />
