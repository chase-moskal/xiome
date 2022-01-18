
export function pluralize(length: number, singular: string, plural: string) {
	return length === 1?
		singular:
		plural
}
