<script>
	import { browser } from "$app/environment";
	import { enhance } from '$app/forms';
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

	export let data; console.log(data.server.sequence.sequence)
	// Use server, then stream after load?
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