<script>
	// import { _projectUrl } from './../api/supabase/+server';
	import { createClient } from '@supabase/supabase-js'
	import * as env from '$env/static/public'
	import { browser } from "$app/environment"
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte';
	$: result = 'default'
	let userId = '';

	export let data; 
	console.log(data.server.sequence.sequence)

	// Browser client mostly to get jwt auth from localStorage
	const supabase = createClient(env.PUBLIC_SUPABASE_PROJECT_URL, env.PUBLIC_SUPABASE_API_KEY, {
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false
		}
	})

	// NOTE: this is used to test local SSE
	// Use server, then stream after load?
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

	async function getUserId() {
		const user = await supabase.auth.getUser()
		if (user.data) {
			userId = user?.data?.user?.id || ''
			console.log(userId)
			return userId
		}
		
		const userResponse = await fetch('/api/user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		console.log(userResponse)
		if (userResponse.ok) {
			const user = await userResponse.json()
			console.log(user)
			userId = user.user?.id || ''
			console.log(user.user?.id)
		}
		
		return userId || ''
	}

	console.log(data.server)
	onMount(async () => {
		userId = await getUserId()
	})
	
</script>
<div class="wrapper">
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
		<input type="hidden" name="userId" value="{ userId }" />
		
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