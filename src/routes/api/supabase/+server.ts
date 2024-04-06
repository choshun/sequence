import { createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/private';
import { BehaviorSubject, Observable, ReplaySubject, first, last, takeLast } from 'rxjs'

let sequenceSubject = new BehaviorSubject<any>(1)
const _sequence$: Observable<any> = sequenceSubject.asObservable();
const projectUrl = env?.SUPABASE_PROJECT_URL ? env.SUPABASE_PROJECT_URL : process.env.SUPABASE_PROJECT_URL as string;
const projectKey = env?.SUPABASE_API_KEY ? env.SUPABASE_API_KEY : process.env.SUPABASE_API_KEY as string;

export const _supabase = createClient(projectUrl, projectKey, {
	global: {
		fetch: (...args) => fetch(...args),
  	},
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