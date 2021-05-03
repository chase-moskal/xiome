
import {UserAuth} from "./user-auth.js"
import {StatsHub} from "../../stats-hub/types/stats-hub.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {PrivilegeChecker} from "../../tools/permissions/types/privilege-checker.js"
import {platformPermissions} from "../../../../assembly/backend/permissions/standard/platform-permissions.js"

export interface PlatformUserAuth extends Omit<UserAuth, "checker"> {
	statsHub: StatsHub
	checker: PrivilegeChecker<typeof platformPermissions["privileges"]>
	tablesForApp(appId: string): Promise<AuthTables>
}
