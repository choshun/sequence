// Only update one entry
/**
 * 1. make route with /frist 
 * 2. fetch from here - maybe user_id/name
 * 3. maybe make unique constraint user_id/name
 * 3. update JSON on front end, hit save, reload - should be there
 * 4. have it in another browser make sure both windows update
 */

/**
 * other stuff, login, get user id
 * https://supabase.com/docs/reference/javascript/auth-api - just use that and github
 */

import { error } from '@sveltejs/kit'
import { _fetchSequenceById, _updateSequenceById, type PageData, type Sequence } from "../api/sequence/+server";


export async function load({params}): Promise<PageData | null> {
	console.log(params)
	const sequence = await _fetchSequenceById(+params.sequence)

	console.log(sequence)

	if (sequence) {
		return {
			sequence
		}
	}

	error(404, 'Not found');
}

export const actions = {
	update: async ({ params, request }) => {
		console.log(params.sequence)
		const formData: any = await request.formData();
		const sequenceData = JSON.parse(formData.get('sequence'))
		console.log(JSON.parse(formData.get('sequence')))
		const sequence = await _updateSequenceById(+params.sequence, sequenceData)
	}
}