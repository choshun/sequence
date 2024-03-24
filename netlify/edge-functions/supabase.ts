import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { BehaviorSubject, Observable } from 'https://esm.sh/rxjs@7.8.1'
import type { Context } from "@netlify/edge-functions";

let sequenceSubject = new BehaviorSubject<any>(1)
const _sequence$: Observable<any> = sequenceSubject.asObservable();
const projectUrl = Netlify.env.get("SUPABASE_PROJECT_URL");
const projectKey = Netlify.env.get("SUPABASE_API_KEY");
const _supabase = createClient(projectUrl, projectKey, {
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
			sequenceSubject.next(payload.new)
		})
		.subscribe()


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
