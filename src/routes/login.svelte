<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';

	let loading = false;

	let email;
	let password;

	async function loginUser() {
		loading = true;
		let { error } = await supabase.auth.signIn({
			email,
			password
		});

		if (error) {
			loading = false;
			alert(error);
			return;
		}

		let redirect = $page.url.searchParams.get('redirect') || '/';
		if (!password) {
			redirect = `${redirect}?magic_link=true`;
		}
		goto(redirect);
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="container mx-auto">
	<h1>Login</h1>

	<form on:submit|preventDefault={loginUser}>
		<div class="">
			<input
				id="email"
				type="email"
				class="bg-gray-300 mb-2"
				autocomplete="email"
				placeholder="Email"
				required
				bind:value={email}
			/>
		</div>
		<div>
			<input
				id="password"
				type="password"
				class="bg-gray-300"
				placeholder="Password (optional)"
				bind:value={password}
			/>
		</div>

		<div>
			<button type="submit" class="bg-yellow-500 my-3 p-2" disabled={loading}>
				{loading ? 'Loading ...' : 'Log In'}
			</button>
		</div>
	</form>
</div>
