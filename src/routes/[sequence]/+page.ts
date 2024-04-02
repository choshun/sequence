let updatedSequence: { sequence: any; };
let newSequence;

export const load: any = async ({ parent, data }) => {
	await parent()

	return {
		server: data,
		page: { message: "frist?!" },
		// stream: result
	}
}