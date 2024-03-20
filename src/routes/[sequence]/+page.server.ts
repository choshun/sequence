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
import { _fetchSequenceById, _updateSequenceById, _sequence$, type PageData, type Sequence, _fetchSequenceStreamById } from "../api/sequence/+server";
let count: number = 0
let sequence: any
let updatedSequence: any

console.log("hi");

// _sequence$.subscribe((newSequence) => {
// 	console.log("update", newSequence.sequence)
// 	count++;
// 	console.log("test", count)
// 	// sequence = newSequence
// 	// sequence = newSequence;
// 	updatedSequence = newSequence
// })

// https://stackoverflow.com/questions/74330190/how-to-respond-with-a-stream-in-a-sveltekit-server-load-function
// https://kit.svelte.dev/docs/routing#server
export async function load({params}): Promise<PageData | null> {
	// load is called every update - need to put subscribe outside of load
	// if (count < 3) {
	const sequence = await _fetchSequenceById(+params.sequence) as any
	// const stream = await _fetchSequenceStreamById(97)
	// let test: WritableStream<any> = new WritableStream()
	// console.log(stream)
	

	
	// } else {
		// sequence = {
		// 	sequence: {
		// 		id: 97,
		// 		history: "",
		// 		sequence: {
		// 			"it": "updates?"
		// 		},
		// 		name: "shwa"
		// 	}
		// }

		// sequence = updatedSequence

	//}
	// if (!sequence) {
	// const stream = await sequence;
	// fuck, might need to do stream here
	// console.log(stream)
	console.log(sequence)
	console.log("fired again?")
	//}
	console.log("test", count)
	console.log(sequence)
	count++
	if (sequence) {
		console.log(sequence.sequence);
		return {
			sequence,
			count,
			// stream
		}
	}

	
	console.log(sequence)


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