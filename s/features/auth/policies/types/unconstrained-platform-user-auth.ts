
import {PlatformUserAuth} from "./platform-user-auth.js"
import {AuthTables} from "../../tables/types/auth-tables.js"

export interface UnconstrainedPlatformUserAuth extends PlatformUserAuth {
	bakeTables: (appId: string) => Promise<AuthTables>
}
