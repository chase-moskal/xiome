
import {AuthTables} from "../../tables/types/auth-tables.js"
import {BaseAnonAuth} from "../base/types/contexts/base-anon-auth.js"

export interface AnonAuth extends BaseAnonAuth {
	tables: AuthTables
}
