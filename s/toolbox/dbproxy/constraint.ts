
import {and} from "./helpers.js"
import {ConditionBranch, Conditions, ConstrainTable, Row, Table} from "./types.js"

export function constraint<xNamespace extends Row, xTable extends Table<Row>>({
			table, namespace,
		}: {
			table: xTable
			namespace: xNamespace
		}
	) {

	const spike = (conditionTree: Conditions<Row>) => (
		conditionTree
			? <ConditionBranch<"and", Row>>and({equal: <any>namespace}, conditionTree)
			: <ConditionBranch<"and", Row>>and({equal: <any>namespace})
	)

	return <ConstrainTable<xNamespace, xTable>>{
		async create(...rows) {
			return table.create(
				...rows.map(row => ({...row, ...namespace}))
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
		async assert(options) {
			return table.assert({
				...options,
				conditions: spike(options.conditions),
				make: async() => {
					const row = await options.make()
					return {...row, ...namespace}
				},
			})
		},
		async update(options) {
			const opts: any = options
			return table.update({
				...options,
				conditions: spike(options.conditions),
				upsert: opts.upsert
					? {...opts.upsert, ...namespace}
					: undefined,
				whole: opts.whole
					? {...opts.whole, ...namespace}
					: undefined,
				write: opts.write
					? {...opts.write, ...namespace}
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
