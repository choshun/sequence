import { createClient } from '@supabase/supabase-js'
import * as env from '$env/static/public'

import { BehaviorSubject, Observable } from 'rxjs'

let sequenceSubject = new BehaviorSubject<any>(1)
const _sequence$: Observable<any> = sequenceSubject.asObservable();
// make private, use public on netlify

export const _projectUrl = env?.PUBLIC_SUPABASE_PROJECT_URL ? env.PUBLIC_SUPABASE_PROJECT_URL : process.env.SUPABASE_PROJECT_URL as string;
export const _projectKey = env?.PUBLIC_SUPABASE_API_KEY ? env.PUBLIC_SUPABASE_API_KEY : process.env.SUPABASE_API_KEY as string;

// @todo: 4/7/24 Thinking this should all be in sequence/server?
export const _supabase = createClient(_projectUrl, _projectKey, {
	global: {
		fetch: (...args) => fetch(...args),
  	}
	// ,
	// auth: {
	// 	autoRefreshToken: true,
	// 	persistSession: true,
	// 	detectSessionInUrl: false
	// }
})

const channel = _supabase
	.channel('schema-db-changes')
		.on(
			'postgres_changes',
		{
			event: 'UPDATE',
			schema: 'public',
		},
		(payload) => {
			console.log(payload.new.sequence)
			sequenceSubject.next(payload.new)
		})
		.subscribe()

export function GET(id: number) {

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
        async start(controller) {
            // You can enqueue multiple data asynchronously here.
            _sequence$.pipe().subscribe((session) => {
				console.log(JSON.stringify(session.sequence))
				controller.enqueue(encoder.encode(`${JSON.stringify(session)}`))
			})
            // controller.close() 
        },
        cancel() {
            // cancel your resources here
        }
    });

    return new Response(stream, {
        headers: {
            // Denotes the response as SSE
            'Content-Type': 'text/event-stream', 
            // Optional. Request the GET request not to be cached.
            'Cache-Control': 'no-cache', 
        }
    })
}


