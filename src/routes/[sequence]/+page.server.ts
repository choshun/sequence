import { error } from '@sveltejs/kit'
import { _fetchSequenceById, _updateSequenceById, type PageData, type Sequence, _createSequence } from "../api/sequence/+server";
import { _projectUrl, _projectKey, _supabase } from '../api/supabase/+server';

let count: number = 0

// https://stackoverflow.com/questions/74330190/how-to-respond-with-a-stream-in-a-sveltekit-server-load-function
// https://kit.svelte.dev/docs/routing#server
export async function load({params}): Promise<any | null> {
	const sequence = await _fetchSequenceById(+params.sequence) as any
	console.log(sequence)
	count++
	
	if (sequence) {
		return {
			sequence,
			count
		}
	}

	error(404, 'Not found');
}

export const actions = {
	update: async ({ params, request }) => {
		const formData: any = await request.formData();
		const sequenceData = JSON.parse(formData.get('sequence'))
		const userId = formData.get('userId')
		const sequence = await _updateSequenceById(+params.sequence, sequenceData, userId)
	}
}