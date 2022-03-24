
export function priceInCents(value: string) {
	return value
		? Math.round(parseFloat(value) * 100)
		: undefined
}

export function centsToPrice(cents: number) {
	return (cents / 100).toFixed(2)
}
