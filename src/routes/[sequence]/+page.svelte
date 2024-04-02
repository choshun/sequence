<script>
	import { browser } from "$app/environment";
	$: result = 'default'

	if (browser) {
		async function getStream() {
			// @todo 3/24/24
			// This works! http://localhost:8888/stream, after doing dev:netlify
			// Use this for local, but try to link up with https://cho-cho-choo-choo.com.netlify.app/stream
			// chrome is being (is a good way) aggressive with seeing the response, maybe try to show the example stream
			const streamUrl = import.meta.env.PROD ? location.href.slice(0, -1) + '.netlify.app/stream' : '/api/supabase'
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

	// maybe type? use interface from server?
	import { enhance } from '$app/forms';
	export let data; console.log(data.server.sequence.sequence)
	console.log(data.server.sequence.sequence)
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