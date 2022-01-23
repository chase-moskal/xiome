
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {AuthTables} from "../../../features/auth/types/auth-tables.js"
import {StoreTables} from "../../../features/store/types/store-tables.js"
import {VideoTables} from "../../../features/videos/types/video-tables.js"
import {NotesTables} from "../../../features/notes/api/tables/notes-tables.js"
import {AppTables} from "../../../features/auth/aspects/apps/types/app-tables.js"
import {ExampleTables} from "../../../features/example/api/types/example-tables.js"
import {QuestionsTables} from "../../../features/questions/api/tables/types/questions-tables.js"
import {SchemaToUnconstrainedTables} from "../../../framework/api/types/unconstrained-tables.js"
import {assimilateDatabase} from "../assimilators/assimilate-database.js"
import {Await} from "../../../types/await.js"
import {RemoveIndex} from "../../../toolbox/types/remove-index.js"

export const appConstraintKey = "namespace-appId"

export type AppConstraint = dbproxy.AsRow<{
	[appConstraintKey]: dbproxy.Id
}>

export type DatabaseSchemaUnisolated = dbproxy.UnconstrainSchema<
	AppConstraint,
	dbproxy.AsSchema<{
		apps: AppTables
	}>
>

export type DatabaseSchemaRequiresAppIsolation = dbproxy.UnconstrainSchema<
	AppConstraint,
	dbproxy.AsSchema<{
		auth: AuthTables
		notes: NotesTables
		store: StoreTables
		videos: VideoTables
		example: ExampleTables
		questions: QuestionsTables
	}>
>

export type DatabaseSchema =
	DatabaseSchemaUnisolated &
	DatabaseSchemaRequiresAppIsolation

export type DatabaseTables =
	dbproxy.SchemaToTables<DatabaseSchemaUnisolated> &
	SchemaToUnconstrainedTables<DatabaseSchemaRequiresAppIsolation>

export type DatabaseFinal = Await<ReturnType<typeof assimilateDatabase>>["database"]

export type DatabaseSubsection<xGrabbed> = {
	tables: xGrabbed
	transaction<xResult>(action: ({}: {
		tables: xGrabbed
		abort: () => Promise<void>
	}) => Promise<xResult>): Promise<xResult>
}

export type DatabaseSubsection2<K extends keyof RemoveIndex<DatabaseTables>> = DatabaseSubsection<Pick<DatabaseTables, K>>

// export type DatabaseFinal = {
// 	tables: DatabaseTables
// 	transaction<xResult>(action: dbproxy.Action<DatabaseTables, xResult>): Promise<xResult>
// 	grabDatabaseSubsection<xGrabbed>(grabber: (t: DatabaseTables) => xGrabbed): {
// 		tables: xGrabbed
// 		transaction<xResult>(
// 			action: ({}: {
// 				tables: xGrabbed
// 				abort(): Promise<void>
// 			}) => Promise<xResult>
// 		): xResult
// 	}
// }
