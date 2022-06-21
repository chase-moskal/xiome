
import * as dbmage from "dbmage"

import {makePermissionsInteractions} from "./permissions-interactions.js"
import {PermissionsInteractions, PermissionsInteractionsSchema} from "./interactions-types.js"
import {UserHasRoleRow} from "../../auth/aspects/permissions/types/permissions-tables.js"

export function mockPermissionsInteractions({generateId}: {
		generateId: () => dbmage.Id
	}) {

	const database = dbmage.memory<PermissionsInteractionsSchema>({
		shape: {
			role: true,
			userHasRole: true,
		}
	})

	return {
		database,
		permissions: makePermissionsInteractions({
			generateId,
			database,
		}),
	}
}
