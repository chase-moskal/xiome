
import {SystemTables} from "./system-tables.js"
import {AuthOptions} from "../../../features/auth/auth-types.js"

export interface ApiOptions extends AuthOptions {
	tables: SystemTables
}
