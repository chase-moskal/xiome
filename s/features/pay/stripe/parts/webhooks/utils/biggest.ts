
export function biggest(...args: number[]) {
	let x = 0
	for (const y of args) {
		if (y > x) x = y
	}
	return x
}
