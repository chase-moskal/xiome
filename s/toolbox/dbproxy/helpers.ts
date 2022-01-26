
import {Row, ConditionLeaf, Table, Conditional} from "./types.js"

export function and<
		xRow extends Row,
		C extends ConditionLeaf<xRow>[] = ConditionLeaf<xRow>[]
	>(...conditions: C): ["and", ...C] {
	return ["and", ...conditions]
}

export function or<
		xRow extends Row,
		C extends ConditionLeaf<xRow>[] = ConditionLeaf<xRow>[]
	>(...conditions: C): ["or", ...C] {
	return ["or", ...conditions]
}

export function find<xRow extends Row>(...rows: Partial<xRow>[]) {
	return rows.length
		? {conditions: or(...rows.map(row => ({equal: row})))}
		: {conditions: false as const}
}

export function findAll<V, xRow extends Row = Row>(
		values: V[],
		valueForRow: (v: V) => Partial<xRow>,
	) {
	return {conditions: or(...values.map(v => ({equal: valueForRow(v)})))}
}

export async function assert<xRow extends Row>(
		table: Table<xRow>,
		conditional: Conditional<xRow>,
		make: () => Promise<xRow>,
	) {
	let row = await table.readOne(conditional)
	if (!row) {
		row = await make()
		await table.create(row)
	}
	return row
}
