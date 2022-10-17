
import * as dbmage from "dbmage"
import {StoreDatabase, StoreSchema} from "./types/schema.js"

export function getConnectedStoreDatabase({
			tables,
			transaction,
		}: StoreDatabase,
		connectId: dbmage.Id
	): StoreDatabase {

	const constraint = {connectId}

	return {
		tables: constrainStoreTables(tables, constraint),
		transaction: (async(action) =>
			transaction(async({tables: t2, ...more}) =>
				action({
					tables: constrainStoreTables(t2, constraint),
					...more
				})
			)
		),
	}
}

export type ConnectConstraint = {connectId: dbmage.Id}

function constrainStoreTables(
		tables: dbmage.SchemaToTables<StoreSchema>,
		constraint: ConnectConstraint,
	) {

	const {connect, ...tablesThatShouldBeConstrained} = tables

	return {
		connect,
		...dbmage.constrainTables({
			constraint,
			tables: tablesThatShouldBeConstrained,
		}),
	}
}
