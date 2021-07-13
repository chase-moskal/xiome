
import {PlatformUserAuth} from "./platform-user-auth.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"

export interface AppOwnerAuth extends PlatformUserAuth {
	getTablesNamespacedForApp: (appId: DamnId) => Promise<AuthTables>
}
