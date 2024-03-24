import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { BehaviorSubject, Observable } from 'https://esm.sh/rxjs@7.8.1'
import type { Context } from "@netlify/edge-functions";

// export default () => new Response("hi there?")

export default async (request: Request, context: Context) => {
	let index = 0
	const encoder = new TextEncoder();
	const body = new ReadableStream({
		start(controller) {
			_sequence$.pipe().subscribe((session) => {
				console.log(JSON.stringify(session.sequence))
				controller.enqueue(encoder.encode(`${JSON.stringify(session)}`))
			})
		},
	});
	return new Response(body, {
		headers: {
			"Content-Type": "text/event-stream",
		},
	});
}


export const config = { path: "/stream" }

let sequenceSubject = new BehaviorSubject<any>(1)
const _sequence$: Observable<any> = sequenceSubject.asObservable();
const projectUrl = process.env.SUPABASE_PROJECT_URL as string;
const projectKey = process.env.SUPABASE_API_KEY as string;

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
 
