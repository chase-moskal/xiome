import {BaseAnonAuth} from "../policies/base/types/contexts/base-anon-auth.js"
import {AuthTables} from "../tables/types/auth-tables.js"


export interface AnonAuth extends BaseAnonAuth {
	tables: AuthTables
}
