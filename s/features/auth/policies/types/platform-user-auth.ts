
import {UserAuth} from "./user-auth.js"
import {StatsHub} from "../../stats-hub/types/stats-hub.js"
import {PrivilegeChecker} from "../../tools/permissions/types/privilege-checker.js"
import {platformPermissions} from "../../../../assembly/backend/permissions2/standard-permissions.js"

export interface PlatformUserAuth extends Omit<UserAuth, "checker"> {
	statsHub: StatsHub
	checker: PrivilegeChecker<typeof platformPermissions["privileges"]>
}
