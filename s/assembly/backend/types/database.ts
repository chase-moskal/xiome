
import {AuthTables} from "../../../features/auth2/types/auth-tables.js"
import {AppTables} from "../../../features/auth2/aspects/apps/types/app-tables.js"
import {StoreTables} from "../../../features/store/api/tables/types/store-tables.js"
import {QuestionsTables} from "../../../features/questions/api/tables/types/questions-tables.js"

export type DatabaseRaw = {
	appTables: AppTables
}

export type DatabaseNamespaced = {
	authTables: AuthTables
	storeTables: StoreTables
	questionsTables: QuestionsTables
}
