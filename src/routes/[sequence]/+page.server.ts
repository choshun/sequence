import { error } from '@sveltejs/kit'
import { _fetchSequenceById, _updateSequenceById, type PageData, type Sequence, _fetchSequenceStreamById } from "../api/sequence/+server";
import { _signIn, _getUser, _getSession, _signOut } from '../api/user/+server';
import { _projectUrl, _projectKey, _supabase } from '../api/supabase/+server';

let count: number = 0

// https://stackoverflow.com/questions/74330190/how-to-respond-with-a-stream-in-a-sveltekit-server-load-function
// https://kit.svelte.dev/docs/routing#server
export async function load({params}): Promise<PageData | null> {
	const sequence = await _fetchSequenceById(+params.sequence) as any
	count++
	// _signOut()
	// where is the jwt here?:
	/**
	 * {
    user: {
      id: 'b8219634-92d4-4ad9-8825-762a4b3ed6b0',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'choshun.snyder@gmail.com',
      phone: '',
      confirmation_sent_at: '2024-04-08T17:18:54.412232468Z',
      app_metadata: { provider: 'email', providers: [ 'email' ] },
      user_metadata: {
        email: 'choshun.snyder@gmail.com',
        email_verified: false,
        phone_verified: false,
        sub: 'b8219634-92d4-4ad9-8825-762a4b3ed6b0'
      },
      identities: [
        {
          identity_id: 'b6de694c-1b87-462f-8e4d-6b8d98fa6101',
          id: 'b8219634-92d4-4ad9-8825-762a4b3ed6b0',
          user_id: 'b8219634-92d4-4ad9-8825-762a4b3ed6b0',
          identity_data: {
            email: 'choshun.snyder@gmail.com',
            email_verified: false,
            phone_verified: false,
            sub: 'b8219634-92d4-4ad9-8825-762a4b3ed6b0'
          },
          provider: 'email',
          last_sign_in_at: '2024-04-08T17:18:54.407933409Z',
          created_at: '2024-04-08T17:18:54.407979Z',
          updated_at: '2024-04-08T17:18:54.407979Z',
          email: 'choshun.snyder@gmail.com'
        }
      ],
      created_at: '2024-04-08T17:18:54.402324Z',
      updated_at: '2024-04-08T17:18:54.816717Z',
      is_anonymous: false
    },
    session: null
  }
	 */
	
  	_signIn()
	const user = await _getUser()
	const session = await _getSession()
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
	}
}