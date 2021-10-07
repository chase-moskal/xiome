
export interface QueryData {
	[key: string]: string
}

export function makeQueryString(query: QueryData) {
	const entries = Object.entries(query)

	let queryString = entries.length
		? "?"
		: ""

	queryString += entries
		.map(([key, data]) => `${key}=${data}`)
		.join("&")

	return queryString
}
