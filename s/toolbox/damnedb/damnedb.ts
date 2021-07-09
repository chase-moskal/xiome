
// //
// // WHAT HAPENED TO DAMNEDB?
// //
// // this is a sketch of a future dbby replacment
// // designed for mongodb session-level transactions
// // and perhaps adding postgres support
// //
// // we shelved this project,
// // because we need to wait for mongodb@4
// //

// import {DamnedId} from "./damned-id.js"
// import {MongoClient, ClientSession} from "mongodb"

// export type DamnedValue =
// 	| DamnedId
// 	| undefined
// 	| boolean
// 	| number
// 	| string
// 	| bigint

// export type DamnedRow = {[key: string]: DamnedValue}
// export type DamnedSchema = {}
// export type Schema = {}
// export type Tables = any
// export type SchemaToTables<xSchema extends Schema> = Tables
// export type Action<xTables extends Tables, xResult>= (tables: xTables) => Promise<xResult>

// export type Damnedb<xTables extends Tables> = {
// 	tables: xTables
// 	transaction<xResult>(
// 			action: Action<xTables, xResult>
// 		): Promise<xResult>
// }

// export function damnedb<xSchema extends Schema>(
// 		schema: xSchema,
// 		client: MongoClient
// 	): Damnedb<SchemaToTables<xSchema>> {

// 	function getTables(session: ClientSession): Tables {}

// 	return {
// 		async transaction(action) {
// 			const session = client.startSession()
// 			const collections = getTables(session)
// 			try {
// 				const result = await action(collections)
// 				session.commitTransaction()
// 				return result
// 			}
// 			catch (error) {
// 				session.abortTransaction()
// 				throw error
// 			}
// 		},
// 		tables: {},
// 	}
// }

// async function lol() {
// 	const client = new MongoClient("lol")
// 	const database = damnedb({}, client)
// }
