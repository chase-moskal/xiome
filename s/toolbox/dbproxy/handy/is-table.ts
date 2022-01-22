
export function isTable(possibleTable: any) {
	return typeof possibleTable.create === "function"
}
