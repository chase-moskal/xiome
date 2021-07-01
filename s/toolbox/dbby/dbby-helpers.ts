
import {DbbyRow, DbbyConditionLeaf} from "./dbby-types.js"

export function and<
		Row extends DbbyRow,
		C extends DbbyConditionLeaf<Row>[] = DbbyConditionLeaf<Row>[]
	>(...conditions: C): ["and", ...C] {
	return ["and", ...conditions]
}

export function or<
		Row extends DbbyRow,
		C extends DbbyConditionLeaf<Row>[] = DbbyConditionLeaf<Row>[]
	>(...conditions: C): ["or", ...C] {
	return ["or", ...conditions]
}

export function find<Row extends DbbyRow>(...rows: Partial<Row>[]) {
	return rows.length
		? {conditions: or(...rows.map(row => ({equal: row})))}
		: {conditions: false as const}
}
