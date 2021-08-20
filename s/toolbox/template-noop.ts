
export function noop(strings: TemplateStringsArray, ...keys: any[]) {
	const lastIndex = strings.length - 1
	return strings
		.slice(0, lastIndex)
		.reduce((a, b, c) => a + b + keys[c], "")
			+ strings[lastIndex]
}
