
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {AuthTables} from "../../../features/auth/types/auth-tables.js"
import {StoreTables} from "../../../features/store/types/store-tables.js"
import {VideoTables} from "../../../features/videos/types/video-tables.js"
import {NotesTables} from "../../../features/notes/api/tables/notes-tables.js"
import {AppTables} from "../../../features/auth/aspects/apps/types/app-tables.js"
import {ExampleTables} from "../../../features/example/api/types/example-tables.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"
import {QuestionsTables} from "../../../features/questions/api/tables/types/questions-tables.js"
import {SchemaToUnconstrainedTables} from "../../../framework/api/types/schema-to-unconstrained-tables.js"

export const appConstraintKey = "namespace-appId"

export type AppConstraint = dbproxy.AsRow<{
	[appConstraintKey]: dbproxy.Id
}>

export type DatabaseSchemaWithoutAppIsolation = dbproxy.UnconstrainSchema<
	AppConstraint,
	dbproxy.AsSchema<{
		apps: AppTables
	}>
>

export type DatabaseSchemaWithAppIsolation = dbproxy.UnconstrainSchema<
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
	DatabaseSchemaWithoutAppIsolation &
	DatabaseSchemaWithAppIsolation

export type DatabaseTables =
	dbproxy.SchemaToTables<DatabaseSchemaWithoutAppIsolation> &
	SchemaToUnconstrainedTables<DatabaseSchemaWithAppIsolation>
