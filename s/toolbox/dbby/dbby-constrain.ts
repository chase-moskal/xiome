
import {objectMap} from "../object-map.js"

import {and, isDbbyTable} from "./dbby-helpers.js"
import {_dbbyTableSymbol} from "./dbby-table-symbol.js"
import {DbbyTable, DbbyRow, DbbyConditionBranch, DbbyConditions, DbbyTables, DbbyConstrainTables, DbbyConstrainTable, DbbyExtractRow, DbbyConditionTree} from "./dbby-types.js"

export function dbbyConstrain<Namespace extends DbbyRow, xTable extends DbbyTable<DbbyRow>>({
		table,
		namespace,
	}: {
		table: xTable
		namespace: Namespace
	}) {

	const spike = (conditionTree: DbbyConditions<DbbyRow>) => (
		conditionTree
			? <DbbyConditionBranch<"and", DbbyRow>>and({equal: <any>namespace}, conditionTree)
			: <DbbyConditionBranch<"and", DbbyRow>>and({equal: <any>namespace})
	)

	return <DbbyConstrainTable<Namespace, xTable>>{
		[_dbbyTableSymbol]: true,

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

export function dbbyConstrainTables<xNamespace extends DbbyRow, xTables extends DbbyTables>({
		namespace,
		tables,
	}: {
		namespace: DbbyRow,
		tables: xTables,
	}) {
	return <DbbyConstrainTables<xNamespace, xTables>>objectMap(tables, value => {
		return isDbbyTable(value)
			? dbbyConstrain({namespace, table: value})
			: dbbyConstrainTables({namespace, tables: value})
	})
}
