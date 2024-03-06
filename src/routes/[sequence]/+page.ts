// Should defo use this, but need to make an api folder

// import { error } from '@sveltejs/kit';
// import { sequence } from '@sveltejs/kit/hooks';

// export function load({ params }): any {
// 	console.log(params)

// 	if (params.sequence === 'hello-world') {
// 		return {
// 			title: 'Hello world!',
// 			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
// 		};
// 	}

// 	// try to fetch - if it exists return data, else 404
// 	return {
// 		sequence: params.sequence
// 	}

// 	error(404, 'Not found');
// }