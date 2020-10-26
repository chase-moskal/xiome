
import {and} from "./dbby-helpers.js"
import {DbbyTable, DbbyRow, DbbyCondition, DbbyConditions} from "./dbby-types.js"

export function dbbyConstrain<Row extends DbbyRow, Constraint extends DbbyRow>(
		table: DbbyTable<Row>,
		constraint: Constraint,
	): DbbyTable<Row & Partial<Constraint>> {

	const tab = <DbbyTable<Row & Partial<Constraint>>>table

	const condition: DbbyCondition<Row & Partial<Constraint>> = {
		equal: <any>constraint
	}

	const spike = (conditions: DbbyConditions<Row & Partial<Constraint>>) => (
		conditions
			? and(condition, conditions)
			: and(condition)
	)

	return {
		async create(...rows) {
			return tab.create(
				...rows.map(row => ({...row, ...constraint}))
			)
		},
		async read(options) {
			return tab.read({
				...options,
				conditions: spike(options.conditions),
			})
		},
		async one(options) {
			return tab.one({
				...options,
				conditions: spike(options.conditions),
			})
		},
		async assert(options) {
			return tab.assert({
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
			return tab.update({
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
			return tab.delete({
				...options,
				conditions: spike(options.conditions),
			})
		},
		async count(options) {
			return tab.count({
				...options,
				conditions: spike(options.conditions),
			})
		},
	}
}
