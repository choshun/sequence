<script>
	// import { _projectUrl } from './../api/supabase/+server';
	import { createClient } from '@supabase/supabase-js'
	import * as env from '$env/static/public'
	import { browser } from "$app/environment"
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte';
	$: result = 'default'

	if (browser) {
		async function getStream() {
			const streamUrl = import.meta.env.PROD ? location.origin + '/stream' : '/api/supabase'
			const response = await fetch(streamUrl)
			const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
			while (true) {
				// @ts-ignore
				const { value, done } = await reader.read()
				if (done) break
				result = JSON.stringify(JSON.parse(value).sequence)
			}
		}

		getStream()
	}

	const supabase = createClient(env.PUBLIC_SUPABASE_PROJECT_URL, env.PUBLIC_SUPABASE_API_KEY, {
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false
		}
	})

	async function signIn() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: 'choshun.snyder@gmail.com',
			password: 'example-password',
		})

		// just update the row?
		// make url have sequence id? session id? need to look at row level security
		// https://supabase.com/docs/guides/auth/auth-deep-dive/auth-deep-dive-jwts, part 2
		console.log("hullo", data)
		return data
	}

	// signIn()
	
	// @todo 4/8/2024
	// make a new supabase client here with passed in credentials
	// check local storage
	// 		try to use jwt to use getUser in backend
	// pass this to backend to update row in supabase, at least the row user_id
	// pass in backend to update new session table with user_id and session_id. 


	export let data; console.log(data.server.sequence.sequence)
	// Use server, then stream after load?
	console.log(data.server.sequence.sequence)
	
	console.log(data.server)
	onMount(async () => {
		const user = await signIn()
		console.log(user);

		console.log(JSON.parse(localStorage.getItem(env.PUBLIC_SUPABASE_AUTH_KEY)).access_token)
	})
	
</script>
<div class="wrapper">


<!-- Make value a form, submit and update -->
<form
	method="POST"
	class="form-sequence"
	action="?/update"
	use:enhance={() => {
		return ({ update }) => update({reset: false})
	}}
>	
	{ result }
	<pre class="pre">{ JSON.stringify(data, null, 4) }</pre>
	<label for="sequence-input" class="label-sequence">
		Sequence
		<textarea name="sequence" id="sequence-input" class="input-sequence">{ JSON.stringify(data.server.sequence.sequence, null, 4) }</textarea>
	</label>

	<button>
		update
	</button>
</form>

</div>

<style lang="scss">
	.wrapper {
		display: flex;
		align-items:center;
	}

	.pre {
		font-size: 2rem;
	}

	.form-sequence {
		background-color: #ff00bf;
		text-shadow: none;
		padding: 3rem;
		display: flex;
		row-gap: 2rem;
		width: 40rem;
		flex-direction: column;
	}

	.label-sequence {
		width: 100%;
		display: flex;
		flex-direction: column;
		row-gap: 2rem;
	}

	.input-sequence {
		height: 20rem;
		width: 100%;
		padding: 2rem;
		box-sizing: border-box;
		background-color: #000;
		color: #fff;
	}
</style>