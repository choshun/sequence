import { _supabase } from "../supabase/+server"
// import { supabaseClient } from '$lib/supabaseClient';

console.log(_supabase)

// I should probably call this session or something
export interface Sequence {
	id: number,
	sequence: any, // type eventually
	history: any, // type eventually
	name: string
}

export interface PageData {
	sequence: Sequence,
	count: number,
	user: any,
	projectUrl: string,
	projectKey: string,
}
// export async function _fetchSequenceById(id: number): Promise<Sequence | null> {
export async function _fetchSequenceById(id: number) {
	/**
	 * essentially I want to call this onload, then use a stream after
	 * hopefully updatedby the observable
	 */
	const { data: { session } } = await _supabase.auth.getSession();
  	const accessToken = session?.access_token;
	console.log("accessToken", accessToken)

	const { data } = await _supabase
		.from("Sequence")
		.select('id, sequence, history, name')
		.eq('id', id) // couldn't find byPk
		
	if (data === null) {
		return null
	}
	
	console.log(data[0])

	return data[0];
}

// Should be able to use this for updating row for userId
export async function _updateSequenceById(id: number, sequence: any): Promise<Sequence | null> {
	const { data } = await _supabase
	 	.from('Sequence')
	 	.update([
			{ 
				sequence
			}
	 	])
		.eq('id', id)
}