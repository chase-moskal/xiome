
import {App} from "../../types/tokens/app.js"
import {AuthTables} from "../../tables/types/auth-tables.js"

export interface AnonAuth {
	app: App
	tables: AuthTables
}
