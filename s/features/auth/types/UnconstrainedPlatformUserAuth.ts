import {AuthTables} from "../tables/types/auth-tables.js"
import {PlatformUserAuth} from "./PlatformUserAuth.js"


export interface UnconstrainedPlatformUserAuth extends PlatformUserAuth {
	bakeTables: (appId: string) => Promise<AuthTables>
}
