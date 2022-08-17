
import {Id} from "dbmage"
import * as dbmage from "dbmage"

import {RoleRow, UserHasRoleRow} from "../../auth/aspects/permissions/types/permissions-tables.js"

export type PreparePermissionsInteractions = (appId: dbmage.Id) => PermissionsInteractions

export type PermissionsInteractionsSchema = dbmage.AsSchema<{
	role: RoleRow
	userHasRole: UserHasRoleRow
}>

export type PermissionsInteractionsDatabase
	= dbmage.Database<PermissionsInteractionsSchema>

export interface PermissionsInteractions {
	grantUserRoles({}: {
			userId: Id
			timeframeEnd: number
			timeframeStart: number
			roleIds: Id[]
		}): Promise<void>
	revokeUserRoles({}: {
			userId: Id
			roleIds: Id[]
		}): Promise<void>
	createRoleForNewSubscriptionTier({}: {label: string}): Promise<{roleId: Id}>
	readRole(roleId: dbmage.Id): Promise<dbmage.Row>
	updateRole({}: {label: string, roleId: Id}): Promise<void>
}
