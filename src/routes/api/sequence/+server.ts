import { createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/private';

const projectUrl = env?.SUPABASE_PROJECT_URL ? env.SUPABASE_PROJECT_URL : process.env.SUPABASE_PROJECT_URL as string;
const projectKey = env?.SUPABASE_API_KEY ? env.SUPABASE_API_KEY : process.env.SUPABASE_API_KEY as string;
const supabase = createClient(projectUrl, projectKey, {
	global: {
		fetch: (...args) => fetch(...args),
  	},
})

export interface Sequence {
	id: number,
	sequence: any, // type eventually
	history: any, // type eventually
	name: string
}

export interface PageData {
	sequence: Sequence
}

export async function _fetchSequenceById(id: number): Promise<Sequence | null> {
	const { data } = await supabase
		.from("Sequence")
		.select('id, sequence, history, name')
		.eq('id', id) // couldn't find byPk
		
	if (data === null) {
		return null
	}

	console.log(data[0])

	return data[0];
}

export async function _updateSequenceById(id: number, sequence: any): Promise<Sequence | null> {
	const { data } = await supabase
	 	.from('Sequence')
	 	.update([
			{ 
				sequence
			}
	 	])
		.eq('id', id)
}