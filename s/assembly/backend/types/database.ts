
import {AuthTables} from "../../../features/auth/tables/types/auth-tables.js"
import {StoreTables} from "../../../features/store/api/tables/types/store-tables.js"
import {QuestionsTables} from "../../../features/questions/api/tables/types/questions-tables.js"

export type Database = {
	core: AuthTables
	store: StoreTables
	questions: QuestionsTables
}
