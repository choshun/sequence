import { _supabase } from "../supabase/+server"

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

export async function _fetchSequenceById(id: number) {
	/**
	 * essentially I want to call this onload, then use a stream after
	 * hopefully updatedby the observable
	 */
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
// Add row level security
export async function _updateSequenceById(id: number, sequence: any, userId?: string): Promise<Sequence | null> {
	const { data } = await _supabase
	 	.from('Sequence')
	 	.update([
			{ 
				sequence,
				user_id: userId
			}
	 	])
		.eq('id', id)
	
	return data;
}

export async function _createSequence(sequence: any, id?: number): Promise<Sequence | null> {
	const { data } = await _supabase
		.from('Sequence')
		.insert([
			{
				sequence,
				id: 157
			}
		])

	return data
}