
import * as dbmage from "dbmage"
import {UnconstrainedTable} from "../../../../../framework/api/unconstrained-table.js"
import {SchemaToUnconstrainedTables} from "../../../../../framework/api/types/unconstrained-tables.js"

import {RoleManager, RoleManagerDatabase, RoleManagerSchema} from "./types.js"

export function makeRoleManager({database, generateId}: {
		database: RoleManagerDatabase
		generateId: () => dbmage.Id
	}): RoleManager {
	
	return {
		async grantUserRoles({
				userId, roleIds, timeframeEnd, timeframeStart,
			}) {
			await database.transaction(({tables}) => Promise.all(
				roleIds.map(roleId => tables.userHasRole.update({
					...dbmage.find({userId, roleId}),
					upsert: {
						userId,
						hard: true,
						public: true,
						time: Date.now(),
						roleId,
						timeframeStart,
						timeframeEnd,
					},
				}))
			))
		},
		async revokeUserRoles({userId, roleIds}) {
			if (roleIds.length > 0) {
				await database.tables.userHasRole.delete({
					conditions: dbmage.and(
						{equal: {userId}},
						dbmage.or(...roleIds.map(roleId => ({equal: {roleId}}))),
					)
				})
			}
		},
		async createPrivateSystemRole({label}) {
			const roleId = generateId()
			await database.tables.role.create({
				label,
				roleId,
				hard: true,
				public: true,
				assignable: false,
				time: Date.now(),
			})
			return {roleId}
		},
		async readRole(roleId) {
			return await database.tables.role.readOne(
				dbmage.find({roleId: roleId})
			)
		},
		async updateRole({label, roleId}) {
			await database.tables.role.update({
				...dbmage.find({roleId: roleId}),
				write: {label},
		})
		},
		async deleteRoleAndAllRelatedRecords(roleId) {
			const conditional = dbmage.find({roleId: roleId})
			await database.transaction(async({tables}) => Promise.all([
				tables.role.delete(conditional),
				tables.userHasRole.delete(conditional),
			]))
		},
	}
}

export function mockRoleManagerDatabaseRaw(tableStorage: dbmage.FlexStorage) {
	const database = dbmage.flex<RoleManagerSchema>({
		flexStorage: tableStorage,
		shape: {
			role: true,
			userHasRole: true,
		},
		makeTableName: path => ["permissions", ...path].join("-"),
	})
	return UnconstrainedTable.wrapDatabase(database)
}

export function buildFunctionToPrepareRoleManager({
		rando, permissionsDatabaseRaw,
	}: {
		rando: dbmage.Rando
		permissionsDatabaseRaw: dbmage.DatabaseLike<
			SchemaToUnconstrainedTables<RoleManagerSchema>
		>
	}) {
	return (appId: dbmage.Id) => makeRoleManager({
		generateId: () => rando.randomId(),
		database: <RoleManagerDatabase>UnconstrainedTable.constrainDatabaseForApp({
			appId,
			database: permissionsDatabaseRaw,
		})
	})
}
