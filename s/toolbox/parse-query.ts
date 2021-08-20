
export function parseQuery<Q extends {}>(query: string = location.search): Q {
	const parsed = <Q>{}
	query = query.startsWith("?") ? query.slice(1) : query
	query = query.startsWith("#") ? query.slice(1) : query
	const parts = query.split("&")
	for (const part of parts) {
		const [key, ...rest] = part.split("=")
		const value = rest.join("=")
		parsed[decodeURIComponent(key)] = decodeURIComponent(value)
	}
	return parsed
}
