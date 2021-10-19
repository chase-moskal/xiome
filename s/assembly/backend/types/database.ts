
import {AuthTables} from "../../../features/auth/types/auth-tables.js"
import {AppTables} from "../../../features/auth/aspects/apps/types/app-tables.js"
import {ExampleTables} from "../../../features/example/api/types/example-tables.js"
import {StoreTables} from "../../../features/store/api/tables/types/store-tables.js"
import {Unconstrain} from "../../../framework/api/types/table-namespacing-for-apps.js"
import {QuestionsTables} from "../../../features/questions/api/tables/types/questions-tables.js"
import {VideoTables} from "../../../features/videos/types/video-tables.js"

export type DatabaseRaw = {
	apps: AppTables
}

export type DatabaseNamespaced = {
	auth: AuthTables
	store: StoreTables
	videos: VideoTables
	example: ExampleTables
	questions: QuestionsTables
}

export type DatabaseFinal = DatabaseRaw & Unconstrain<DatabaseNamespaced>
