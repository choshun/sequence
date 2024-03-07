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
// insert
// const { data, error } = await supabase
//  	.from('Sequence')
//  	.insert([
// 		{ 
// 			sequence: { "hi!!!": "there!!" },
// 			user_id: 1,
// 			name: "frist"
// 		},
//  	])

// update
// const { error } = await supabase
//  	.from('Sequence')
//  	.update([
// 		{ 
// 			sequence: { "ohhadssadai!!!": "the?!?!re!!" },
// 			name: "frost"
// 		}
//  	])
// 	.eq('id', 96)

import { error } from '@sveltejs/kit'
import { _fetchSequenceById, type PageData } from "../api/sequence/+server";


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