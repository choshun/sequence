import { error } from '@sveltejs/kit'
import { _fetchSequenceById, _updateSequenceById, type PageData, type Sequence, _createSequence } from "../api/sequence/+server";
import { _signIn, _getUser, _getSession, _signOut, _signUp } from '../api/user/+server';
import { _projectUrl, _projectKey, _supabase } from '../api/supabase/+server';

let count: number = 0

// https://stackoverflow.com/questions/74330190/how-to-respond-with-a-stream-in-a-sveltekit-server-load-function
// https://kit.svelte.dev/docs/routing#server
export async function load({params}): Promise<PageData | null> {
	const sequence = await _fetchSequenceById(+params.sequence) as any
	console.log(sequence)
	count++
	// _signUp()
  	const userBoop = await _signIn()
	const user = await _getUser(userBoop.session?.access_token)
	const session = await _getSession()
	// _createSequence(`hello: there`)
	console.log(user)
	console.log(session)
	if (sequence) {
		return {
			sequence,
			count,
			user,
			projectUrl: _projectUrl,
			projectKey: _projectKey,
			// supabase: _supabase
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
		// This works tho
		const session = await _getSession()
		console.log(session)
	}

}