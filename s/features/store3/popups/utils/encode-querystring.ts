
export function encodeQuerystring(result: any) {
	const searchParams = new URLSearchParams({...result})
	return searchParams.toString()
}
