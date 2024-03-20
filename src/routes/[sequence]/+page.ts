

// const sequenceSubject = new ReplaySubject<any>(1)
// export const _sequence$: Observable<any> = sequenceSubject.asObservable();

// import { _fetchSequenceStreamById } from "../api/sequence/+server";

// https://scottspence.com/posts/passing-sveltekit-page-server-js-data-to-page-js
// import { _sequence$ } from '../api/sequence/+server'
// import type { PageLoad } from './$types'

// console.log(_supabase)

let updatedSequence: { sequence: any; };
let newSequence;

// Might have to do this: https://stackoverflow.com/questions/74879852/how-can-i-implement-server-sent-events-sse-in-sveltekit
export const load: any = async ({ parent, data }) => {
	await parent()

	// let result = ''
	// async function getStream() {
	// 	const response = await fetch('/api/supabase')
	// 	const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
	// 	while (true) {
	// 		// @ts-ignore
	// 		const { value, done } = await reader.read();
	// 		console.log("resp", done, value);
	// 		if (done) break;
	// 		result += `${value}<br>`;
	// 	}
	// }
	
	// getStream()

	// _fetchSequenceStreamById(97)
	
	// _sequence$.subscribe((newSequence) => {
	// 	updatedSequence = newSequence
	// 	console.log("update", newSequence.sequence)
	// 	// sequence = newSequence
	// 	// sequence = newSequence;
		
	// })

	return {
		server: data,
		page: { message: "frist?!" }
	}
}