
import {DamnId} from "../damnedb/damn-id.js"
export {and, or, find} from "./dbby-helpers.js"
import {FlexStorage} from "../flex-storage/types/flex-storage.js"
import {DbbyRow, DbbyTable, DbbyCondition, DbbyConditional, DbbyUpdateAmbiguated, DbbyConditionTree, DbbyConditions} from "./dbby-types.js"

export async function dbbyX<Row extends DbbyRow>(
		flexStorage: FlexStorage,
		tableName: string,
	): Promise<DbbyTable<Row>> {

	const serializationKey = "__serialized_type__"

	type SerializedValue = {
		[serializationKey]: "DamnedId",
		serializedValue: string,
	}

	type SerializedRow = {[key: string]: any | SerializedValue}

	function copy<T>(x: T): T {
		if (x === undefined) return undefined
		return JSON.parse(JSON.stringify(x))
	}

	function serialize(table: Row[]): any[] {
		return table.map(row => {
			const serializedRow: SerializedRow = {}
			for (const [key, value] of Object.entries(row)) {
				if (value instanceof DamnId) {
					serializedRow[key] = {
						[serializationKey]: "DamnId",
						serializedValue: value.toString(),
					}
				}
				else
					serializedRow[key] = copy(value)
			}
			return serializedRow
		})
	}

	function deserialize(data: SerializedRow[]): Row[] {
		return data.map(datum => {
			const row = {}
			for (const [key, value] of Object.entries(datum)) {
				if (value && typeof value === "object" && value[serializationKey]) {
					if (value[serializationKey] === "DamnId") {
						row[key] = DamnId.fromString(value.serializedValue)
					}
					else
						throw new Error(`dbby-x unknown serialization type "${value[serializationKey]}"`)
				}
				else {
					row[key] = value
				}
			}
			return <Row>row
		})
	}

	const data = (() => {
		let serialized: SerializedRow[] = []
		return {
			set table(rows: Row[]) {
				serialized = serialize(rows)
			},
			get table() {
				return deserialize(serialized)
			},
		}
	})()

	const storageKey = `dbby-${tableName}`

	async function load() {
		data.table = await flexStorage.read(storageKey) || []
	}

	await load()

	async function save() {
		if (flexStorage)
			await flexStorage.write(storageKey, data.table)
	}

	function select(conditional: DbbyConditional<Row>): Row[] {
		return data.table.filter(row => rowVersusConditional(row, conditional))
	}

	function discriminate(conditional: DbbyConditional<Row>) {
		const yep: Row[] = []
		const nope: Row[] = []
		for (const row of data.table) {
			if (rowVersusConditional(row, conditional))
				yep.push(row)
			else
				nope.push(row)
		}
		return {yep, nope}
	}

	function selectOne(conditional: DbbyConditional<Row>): Row {
		return data.table.find(row => rowVersusConditional(row, conditional))
	}

	function applyPatchToRows(conditional: DbbyConditional<Row>, patch: Partial<Row>) {
		const {yep, nope} = discriminate(conditional)
		const updated = yep.map(row => <Row>({...row, ...patch}))
		data.table = [...updated, ...nope]
	}

	// function updateRow(rows: Row[], update: Partial<Row>) {
	// 	for (const row of rows) {
	// 		for (const [key, value] of Object.entries(update)) {
	// 			;(<any>row)[key] = value
	// 		}
	// 	}
	// }

	function eliminateRow(conditional: DbbyConditional<Row>) {
		const flippedFilterRow = (row: Row) => !rowVersusConditional(
			row,
			conditional
		)
		data.table = data.table.filter(flippedFilterRow)
	}

	function insert(...rows: Row[]) {
		data.table = [...data.table, ...rows]
	}

	return {
		async create(...rows) {
			await load()
			insert(...rows)
			await save()
		},

		async read({order, offset = 0, limit = 1000, ...conditional}) {
			await load()
			const rows = select(conditional)
			if (order) {
				for (const [key, value] of Object.entries(order)) {
					rows.sort((a, b) =>
						value === "ascend"
							? a[key] > b[key] ? 1 : -1
							: a[key] > b[key] ? -1 : 1
					)
				}
			}
			return rows.slice(offset, offset + limit)
		},

		async one(conditional) {
			await load()
			return selectOne(conditional)
		},

		async assert({make, ...conditional}) {
			await load()
			let row = selectOne(conditional)
			if (!row) {
				const made = await make()
				insert(made)
				row = made
				await save()
			}
			return row
		},

		async update({
					write,
					whole,
					upsert,
					...conditional
				}: DbbyUpdateAmbiguated<Row>) {
			await load()
			const rows = select(conditional)
			if (write && rows.length) {
				applyPatchToRows(conditional, write)
			}
			else if (upsert) {
				if (rows.length)
					applyPatchToRows(conditional, upsert)
				else
					insert(upsert)
			}
			else if (whole) {
				eliminateRow(conditional)
				insert(whole)
			}
			else throw new Error("invalid update")
			await save()
		},

		async delete(conditional) {
			await load()
			eliminateRow(conditional)
			await save()
		},

		async count(conditional) {
			await load()
			return select(conditional).length
		},
	}
}

function compare<Row>(
		row: Row,
		conditional: Partial<Row>,
		evaluator: (a: any, b: any) => boolean,
	) {

	let failures = 0

	for (const [key, value] of Object.entries(conditional)) {
		if (!evaluator(row[key], value))
			failures += 1
	}

	return !failures
}

function rowVersusConditional<Row extends {}>(
		row: Row,
		conditional: DbbyConditional<Row>,
	): boolean {

	function crawl(conditions: DbbyConditions<Row>) {
		if (conditions === false) return true
		const [operation, ...rawconds] = conditions
		const conds = rawconds.filter(c => !!c)
		if (conds.length === 0)
			throw new Error("empty and/or conditions are not allowed")
		const and = operation === "and"
		let valid = and
		const applyResult = (result: boolean) =>
			valid = and
				? valid && result
				: valid || result
		for (const condition of conds) {
			if (condition === false || Array.isArray(condition)) {
				applyResult(crawl(<DbbyConditionTree<Row>>condition))
			}
			else {
				const result = rowVersusCondition(row, condition)
				applyResult(result)
			}
		}
		return valid
	}

	return crawl(conditional.conditions)
}

function rowVersusCondition<Row extends DbbyRow>(
		row: Row,
		condition: DbbyCondition<Row>
	): boolean {

	if (!Object.keys(condition).length) return true

	let failures = 0

	type Evaluator = (a: any, b: any) => boolean

	const check = (
			conditions: Partial<{[P in keyof Row]: any}>,
			evaluator: Evaluator
		) => {
		if (conditions && !compare(row, conditions, evaluator))
			failures += 1
	}

	const checks: {[key: string]: Evaluator} = {
		set: a => a !== undefined && a !== null,
		equal: (a, b) =>
			a instanceof DamnId
				? a.string === b.string
				: a === b,
		greater: (a, b) => a > b,
		greatery: (a, b) => a >= b,
		less: (a, b) => a < b,
		lessy: (a, b) => a <= b,
		listed: (a, b) => a.includes(b),
		search: (a, b) => typeof b === "string" ? a.includes(b) : b.test(a),
	}

	function not(evaluator: Evaluator): Evaluator {
		return (a, b) => !evaluator(a, b)
	}

	check(condition.set, checks.set)
	check(condition.equal, checks.equal)
	check(condition.greater, checks.greater)
	check(condition.greatery, checks.greatery)
	check(condition.less, checks.less)
	check(condition.lessy, checks.lessy)
	check(condition.listed, checks.listed)
	check(condition.search, checks.search)
	
	check(condition.notSet, not(checks.set))
	check(condition.notEqual, not(checks.equal))
	check(condition.notGreater, not(checks.greater))
	check(condition.notGreatery, not(checks.greatery))
	check(condition.notLess, not(checks.less))
	check(condition.notLessy, not(checks.lessy))
	check(condition.notListed, not(checks.listed))
	check(condition.notSearch, not(checks.search))

	return !failures
}
