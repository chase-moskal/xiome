
import {objectMap} from "../object-map.js"

import {and} from "./dbby-helpers.js"
import {DbbyTable, DbbyRow, DbbyConditionBranch, DbbyConditions, ConstrainTables} from "./dbby-types.js"

export function dbbyConstrain<Row extends DbbyRow, Constraint extends DbbyRow>(
			table: DbbyTable<Row>,
			constraint: DbbyConditions<Constraint>,
		): DbbyTable<Row> {

	const spike = (conditionTree: DbbyConditions<Row>) => (
		conditionTree
			? <DbbyConditionBranch<"and", Row>>and(constraint, conditionTree)
			: <DbbyConditionBranch<"and", Row>>and(constraint)
	)

	return {
		async create(...rows) {
			return table.create(
				...rows.map(row => ({...row, ...constraint}))
			)
		},
		async read(options) {
			return table.read({
				...options,
				conditions: spike(options.conditions),
			})
		},
		async one(options) {
			return table.one({
				...options,
				conditions: spike(options.conditions),
			})
		},
		async assert(options) {
			return table.assert({
				...options,
				conditions: spike(options.conditions),
				make: async() => {
					const row = await options.make()
					return {...row, ...constraint}
				},
			})
		},
		async update(options) {
			const opts: any = options
			return table.update({
				...options,
				conditions: spike(options.conditions),
				upsert: opts.upsert
					? {...opts.upsert, ...constraint}
					: undefined,
				whole: opts.whole
					? {...opts.whole, ...constraint}
					: undefined,
				write: opts.write
					? {...opts.write, ...constraint}
					: undefined,
			})
		},
		async delete(options) {
			return table.delete({
				...options,
				conditions: spike(options.conditions),
			})
		},
		async count(options) {
			return table.count({
				...options,
				conditions: spike(options.conditions),
			})
		},
	}
}

export function prepareConstrainTables<T extends {[key: string]: DbbyTable<DbbyRow>}>(
			tables: T,
		): ConstrainTables<T> {
	return (constraint: DbbyConditions<DbbyRow>) => <T>objectMap(
		tables,
		table => dbbyConstrain(table, constraint),
	)
}
