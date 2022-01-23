
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {Await} from "../../../types/await.js"
import {RemoveIndex} from "../../../toolbox/types/remove-index.js"
import {AuthSchema} from "../../../features/auth/types/auth-schema.js"
import {StoreSchema} from "../../../features/store/types/store-schema.js"
import {assimilateDatabase} from "../assimilators/assimilate-database.js"
import {VideoSchema} from "../../../features/videos/types/video-schema.js"
import {NotesSchema} from "../../../features/notes/api/tables/notes-schema.js"
import {AppSchema} from "../../../features/auth/aspects/apps/types/app-tables.js"
import {ExampleSchema} from "../../../features/example/api/types/example-tables.js"
import {QuestionsSchema} from "../../../features/questions/api/types/questions-schema.js"
import {SchemaToUnconstrainedTables} from "../../../framework/api/types/unconstrained-tables.js"

export const appConstraintKey = "namespace-appId"

export type AppConstraint = dbproxy.AsRow<{
	[appConstraintKey]: dbproxy.Id
}>

export type DatabaseSchemaUnisolated = dbproxy.UnconstrainSchema<
	AppConstraint,
	dbproxy.AsSchema<{
		apps: AppSchema
	}>
>

export type DatabaseSchemaRequiresAppIsolation = dbproxy.UnconstrainSchema<
	AppConstraint,
	dbproxy.AsSchema<{
		auth: AuthSchema
		notes: NotesSchema
		store: StoreSchema
		videos: VideoSchema
		example: ExampleSchema
		questions: QuestionsSchema
	}>
>

export type DatabaseSchema =
	DatabaseSchemaUnisolated &
	DatabaseSchemaRequiresAppIsolation

export type DatabaseTables = RemoveIndex<
	dbproxy.SchemaToTables<DatabaseSchemaUnisolated> &
	SchemaToUnconstrainedTables<DatabaseSchemaRequiresAppIsolation>
>

export type DatabaseRaw = dbproxy.DatabaseLike<DatabaseTables>
export type DatabaseSafe = dbproxy.Database<DatabaseSchema>

//Await<ReturnType<typeof assimilateDatabase>>["database"]

// export type DatabaseSubsection<xGrabbed> = {
// 	tables: xGrabbed
// 	transaction<xResult>(action: ({}: {
// 		tables: xGrabbed
// 		abort: () => Promise<void>
// 	}) => Promise<xResult>): Promise<xResult>
// }

export type DatabaseSelect<K extends keyof DatabaseTables> =
	dbproxy.DatabaseLike<Pick<DatabaseTables, K>>
