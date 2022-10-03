
import * as dbmage from "dbmage"

import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"
import {SchemaToUnconstrainedTables} from "../../../framework/api/types/unconstrained-tables.js"
import {PermissionsInteractions, PermissionsInteractionsDatabase, PermissionsInteractionsSchema} from "./interactions-types.js"

export function mockPermissionsDatabaseRaw(tableStorage: dbmage.FlexStorage) {
	const database = dbmage.flex<PermissionsInteractionsSchema>({
		flexStorage: tableStorage,
		shape: {
			role: true,
			userHasRole: true,
		},
		makeTableName: path => ["permissions", ...path].join("-"),
	})
	return UnconstrainedTable.wrapDatabase(database)
}

export function buildFunctionToPreparePermissionsInteractions({
		rando, permissionsDatabaseRaw,
	}: {
		rando: dbmage.Rando
		permissionsDatabaseRaw: dbmage.DatabaseLike<
			SchemaToUnconstrainedTables<PermissionsInteractionsSchema>
		>
	}) {
	return (appId: dbmage.Id) => makePermissionsInteractions({
		generateId: () => rando.randomId(),
		database: <PermissionsInteractionsDatabase>UnconstrainedTable.constrainDatabaseForApp({
			appId,
			database: permissionsDatabaseRaw,
		})
	})
}

export function makePermissionsInteractions({database, generateId}: {
		database: PermissionsInteractionsDatabase
		generateId: () => dbmage.Id
	}): PermissionsInteractions {
	
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
		async createRoleForNewSubscriptionTier({label}) {
			const roleId = generateId()
			await database.tables.role.create({
				label,
				roleId,
				// TODO hard should maybe be false?
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
		}
	}
}
