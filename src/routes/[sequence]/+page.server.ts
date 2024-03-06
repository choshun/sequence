import { createClient } from '@supabase/supabase-js'
import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/private';

// Sorta works!
// https://supabase.com/dashboard/project/nrscqlptbcadomrrqftg/editor/28633

const projectUrl = env?.SUPABASE_PROJECT_URL ? env.SUPABASE_PROJECT_URL : process.env.SUPABASE_PROJECT_URL as string;
const projectKey = env?.SUPABASE_API_KEY ? env.SUPABASE_API_KEY : process.env.SUPABASE_API_KEY as string;

console.log(JSON.stringify(process.env, null, 4))

// Look up diff between page.server and page.ts if they're both SSR by default

// put these in process.env
// Provide a custom `fetch` implementation as an option
const supabase = createClient(projectUrl, projectKey, {
	global: {
		fetch: (...args) => fetch(...args),
  	},
})

interface Sequence {
	id: number,
	sequence: any, // type eventually
	history: any, // type eventually
	name: string
}

interface PageData {
	data: Sequence
}

// do this, way better
// https://www.reddit.com/r/sveltejs/comments/x7jdy7/the_differences_between_pagejs_pageserverjs_and/
// essentially page makes calls to api, that then has a server.js that does the GET's
async function fetchSequenceById(id: number): Promise<Sequence | null> {
	const { data, error } = await supabase
		.from("Sequence")
		.select('id, sequence, history, name')
		.eq('id', id)
		
	if (data === null) {
		return null
	}

	console.log(data[0])

	return data[0];
}

export async function load({params}): Promise<PageData | null> {
	console.log(params)
	const sequence = await fetchSequenceById(+params.sequence)

	console.log(sequence)

	if (sequence) {
		return {
			data: sequence
		}
	}

	error(404, 'Not found');
}






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



//  console.log(error)