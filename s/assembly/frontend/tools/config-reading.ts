
export function configReading(selector: string) {
	const element = document.querySelector(selector)

	if (!element)
		throw new Error(`${selector} is required`)

	return {
		attr(key: string) {
			return element.getAttribute(key) ?? undefined
		},
	}
}
