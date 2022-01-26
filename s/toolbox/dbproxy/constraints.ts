
import {and} from "./helpers.js"
import {objectMap} from "../object-map.js"
import {isTable} from "./handy/is-table.js"
import {ConditionBranch, Conditions, ConstrainTable, ConstrainTables, Row, Table, Tables} from "./types.js"

export function constrain<xConstraint extends Row, xTable extends Table<Row>>({
			table, constraint,
		}: {
			table: xTable
			constraint: xConstraint
		}
	) {

	const spike = (conditionTree: Conditions<Row>) => (
		conditionTree
			? <ConditionBranch<"and", Row>>and({equal: <any>constraint}, conditionTree)
			: <ConditionBranch<"and", Row>>and({equal: <any>constraint})
	)

	return <ConstrainTable<xConstraint, xTable>>{
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
		async readOne(options) {
			return table.readOne({
				...options,
				conditions: spike(options.conditions),
			})
		},
		// async assert(options) {
		// 	return table.assert({
		// 		...options,
		// 		conditions: spike(options.conditions),
		// 		make: async() => {
		// 			const row = await options.make()
		// 			return {...row, ...constraint}
		// 		},
		// 	})
		// },
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

export function constrainTables<xConstraint extends Row, xTables extends Tables>({tables, constraint}: {
		tables: xTables
		constraint: xConstraint
	}): ConstrainTables<xConstraint, xTables> {

	function recurse(t: any) {
		return objectMap(t, value =>
			isTable(value)
				? constrain({constraint, table: value})
				: recurse(value)
		)
	}

	return recurse(tables)
}
