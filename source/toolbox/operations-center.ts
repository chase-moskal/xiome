
export function makeOperationsCenter() {
	let count = 0
	const never: Promise<never> = new Promise(() => {})
	return {
		async run<R>(op: Promise<R>): Promise<R | never> {
			count += 1
			const remember = count
			const result = await op
			return count === remember
				? result
				: never
		},
	}
}
