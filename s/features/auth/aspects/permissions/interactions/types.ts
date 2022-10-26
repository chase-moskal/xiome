
import {Id, Database, Row, AsSchema} from "dbmage"
import {RoleRow, UserHasRoleRow} from "../types/permissions-tables.js"

export type PrepareRoleManager = (appId: Id) => RoleManager

export type RoleManagerSchema = AsSchema<{
	role: RoleRow
	userHasRole: UserHasRoleRow
}>

export type RoleManagerDatabase = Database<RoleManagerSchema>

export interface RoleManager {
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
	createPrivateSystemRole({}: {label: string}): Promise<{roleId: Id}>
	readRole(roleId: Id): Promise<Row>
	updateRole({}: {label: string, roleId: Id}): Promise<void>
	deleteRoleAndAllRelatedRecords(roleId: Id): Promise<void>
}
