
export async function stopwatch<X>(promise: Promise<X>) {
	const start = Date.now()
	const result = await promise
	const time = Date.now() - start
	return [time, result]
}
