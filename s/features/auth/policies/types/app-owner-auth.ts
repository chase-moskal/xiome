
import {PlatformUserAuth} from "./platform-user-auth.js"
import {AuthTables} from "../../tables/types/auth-tables.js"

export interface AppOwnerAuth extends PlatformUserAuth {
	getTablesNamespacedForApp: (id_app: string) => Promise<AuthTables>
}
