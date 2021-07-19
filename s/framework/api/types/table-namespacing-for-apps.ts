
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {namespaceKeyAppId} from "../namespace-key-app-id.js"
import {AsDbbyRow, DbbyTables} from "../../../toolbox/dbby/dbby-types.js"
import {dbbyConstrainTables} from "../../../toolbox/dbby/dbby-constrain.js"

export type AppNamespace = AsDbbyRow<{
	[namespaceKeyAppId]: DamnId
}>


export class UnconstrainedTables<xTables extends DbbyTables> {
	constructor(private tables: xTables) {}
	get unconstrained() {
		return this.tables
	}
	namespaceForApp(appId: DamnId) {
		return dbbyConstrainTables<AppNamespace, xTables>({
			tables: this.tables,
			namespace: {[namespaceKeyAppId]: appId},
		})
	}
}


// export type UnconstrainedTables<xTables extends DbbyTables> = (
// 	DbbyUnconstrainTables<AppNamespaceRow, xTables>
// )

// export type ConstrainedTables<xTables extends DbbyTables> = (
// 	DbbyConstrainTables<AppNamespaceRow, xTables>
// )

// export type SafelyConstrainedTable<xTable extends DbbyTable<DbbyRow>> = (
// 	xTable extends DbbyTable<infer xRow>
// 		? xRow extends AppNamespaceRow
// 			? never
// 			: DbbyTable<xRow>
// 		: never
// )

// export type SafelyConstrainedTables<xTables extends DbbyTables> = {
// 	[P in keyof xTables]: xTables[P] extends SafelyConstrainedTable<DbbyTable<DbbyRow>>
// 		? xTables[P] extends DbbyTables
// 			? SafelyConstrainedTables<xTables[P]>
// 			: never
// 		: never
// }

// type LolTable = DbbyTable<{a: number}>
// type LolUnconstrained = DbbyUnconstrainTable<AppNamespaceRow, LolTable>
// type LolConstrained = DbbyConstrainTable<AppNamespaceRow, LolTable>

// let unconstrainedTable: LolUnconstrained
// let constrainedTable: LolConstrained

// let T: SafelyConstrainedTable<LolUnconstrained>

// unconstrainedTable.create({a: 1, "appId-namespace": DamnId.fromString("")})
// constrainedTable.create({a: 1})

// function test(table: SafelyConstrainedTable<LolUnconstrained>) {}
// test(unconstrainedTable)


// type DisallowB<Stuff> = 
// function userQuery(stuff: ) {}
