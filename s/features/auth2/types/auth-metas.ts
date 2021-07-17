
import {AuthTables} from "./auth-tables.js"
import {AccessPayload} from "./auth-tokens.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {StatsHub} from "../aspects/permissions/types/stats-hub.js"
import {PrivilegeChecker} from "../aspects/permissions/types/privilege-checker.js"
import {appPermissions, platformPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

export type GreenMeta = undefined

export interface GreenAuth {
	authTablesForApp: (appId: DamnId) => Promise<AuthTables>
}

export interface AnonMeta {
	accessToken: string
}

export interface AnonAuth {
	access: AccessPayload
	authTables: AuthTables
	checker: PrivilegeChecker<typeof appPermissions["privileges"]>
}

export interface UserMeta extends AnonMeta {}

export interface UserAuth extends AnonAuth {}

export interface PlatformUserMeta extends UserMeta {}

export interface PlatformUserAuth extends Omit<UserAuth, "checker"> {
	statsHub: StatsHub
	checker: PrivilegeChecker<typeof platformPermissions["privileges"]>
}
