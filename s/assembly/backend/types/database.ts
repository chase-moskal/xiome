
import {AuthTables} from "../../../features/auth/types/auth-tables.js"
import {AppTables} from "../../../features/auth/aspects/apps/types/app-tables.js"
import {StoreTables} from "../../../features/store/api/tables/types/store-tables.js"
import {QuestionsTables} from "../../../features/questions/api/tables/types/questions-tables.js"

export type DatabaseRaw = {
	apps: AppTables
}

export type DatabaseNamespaced = {
	auth: AuthTables
	store: StoreTables
	questions: QuestionsTables
}
