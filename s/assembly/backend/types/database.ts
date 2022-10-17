
import * as dbmage from "dbmage"

import {RemoveIndex} from "../../../toolbox/types/remove-index.js"
import {AuthSchema} from "../../../features/auth/types/auth-schema.js"
import {VideoSchema} from "../../../features/videos/types/video-schema.js"
import {NotesSchema} from "../../../features/notes/api/tables/notes-schema.js"
import {AppSchema} from "../../../features/auth/aspects/apps/types/app-tables.js"
import {ExampleSchema} from "../../../features/example/api/types/example-tables.js"
import {StoreSchemaUnconnected} from "../../../features/store/backend/database/types/schema.js"
import {QuestionsSchema} from "../../../features/questions/api/types/questions-schema.js"
import {SchemaToUnconstrainedTables} from "../../../framework/api/types/unconstrained-tables.js"

export const appConstraintKey = "namespace-appId"

export type AppConstraint = dbmage.AsRow<{
	[appConstraintKey]: dbmage.Id
}>

export type DatabaseSchemaUnisolated = dbmage.AsSchema<{
	apps: AppSchema
}>

export type DatabaseSchemaRequiresAppIsolation = dbmage.AsSchema<{
	auth: AuthSchema
	notes: NotesSchema
	store: StoreSchemaUnconnected
	videos: VideoSchema
	example: ExampleSchema
	questions: QuestionsSchema
}>

export type DatabaseSchema =
	DatabaseSchemaUnisolated &
	DatabaseSchemaRequiresAppIsolation

export type DatabaseRawTables = RemoveIndex<
	dbmage.SchemaToTables<DatabaseSchemaUnisolated> &
	SchemaToUnconstrainedTables<DatabaseSchemaRequiresAppIsolation>
>

export type DatabaseRaw = dbmage.DatabaseLike<DatabaseRawTables>
export type DatabaseSafe = dbmage.Database<DatabaseSchema>

export type DatabaseSelect<K extends keyof DatabaseRawTables> =
	dbmage.DatabaseLike<Pick<DatabaseRawTables, K>>
