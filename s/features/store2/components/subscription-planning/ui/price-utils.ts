
export function dollarsToCents(dollars: string) {
	return dollars
		? Math.round(parseFloat(dollars) * 100)
		: undefined
}

export function centsToDollars(cents: number) {
	return (cents / 100).toFixed(2)
}
