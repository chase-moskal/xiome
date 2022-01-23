
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {AuthSchema} from "./auth-schema.js"
import {AccessPayload} from "./auth-tokens.js"
import {AppSchema} from "../aspects/apps/types/app-tables.js"
import {StatsHub} from "../aspects/permissions/types/stats-hub.js"
import {PrivilegeChecker} from "../aspects/permissions/types/privilege-checker.js"
import {appPermissions, platformPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {DatabaseSelect} from "../../../assembly/backend/types/database.js"
import {ConstrainMixedDatabaseLike, ConstrainMixedTables} from "../../../framework/api/types/unconstrained-tables.js"

export type GreenMeta = undefined

export interface GreenAuth {
	database: DatabaseSelect<"apps" | "auth">
}

export interface AnonMeta {
	accessToken: string
}

export interface AnonAuth {
	access: AccessPayload
	database: ConstrainMixedDatabaseLike<DatabaseSelect<"auth">>
	checker: PrivilegeChecker<typeof appPermissions["privileges"]>
}

export interface LoginAuth extends AnonAuth {}

export interface UserMeta extends AnonMeta {}

export interface UserAuth extends AnonAuth {}

export interface PlatformUserMeta extends UserMeta {}

export interface PlatformUserAuth extends Omit<UserAuth, "database" | "checker"> {
	statsHub: StatsHub
	database: DatabaseSelect<"apps" | "auth">
	checker: PrivilegeChecker<typeof platformPermissions["privileges"]>
}

export interface AppOwnerMeta extends PlatformUserMeta {}

export interface AppOwnerAuth extends Omit<PlatformUserAuth, "database"> {
	authTablesForPlatform: dbproxy.SchemaToTables<AuthSchema>
	authorizeAppOwner(appId: dbproxy.Id): Promise<{authTables: dbproxy.SchemaToTables<AuthSchema>}>
}
