import { error } from '@sveltejs/kit'
import { _fetchSequenceById, _updateSequenceById, _sequence$, type PageData, type Sequence, _fetchSequenceStreamById } from "../api/sequence/+server";
let count: number = 0


// https://stackoverflow.com/questions/74330190/how-to-respond-with-a-stream-in-a-sveltekit-server-load-function
// https://kit.svelte.dev/docs/routing#server
export async function load({params}): Promise<PageData | null> {
	const sequence = await _fetchSequenceById(+params.sequence) as any
	count++
	if (sequence) {
		return {
			sequence,
			count,
			// stream
		}
	}

	error(404, 'Not found');
}

export const actions = {
	update: async ({ params, request }) => {
		const formData: any = await request.formData();
		const sequenceData = JSON.parse(formData.get('sequence'))
		const sequence = await _updateSequenceById(+params.sequence, sequenceData)
	}
}