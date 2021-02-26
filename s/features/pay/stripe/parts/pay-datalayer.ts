
import {find} from "../../../../toolbox/dbby/dbby-x.js"
import {PermissionsTables} from "../../../auth/auth-types.js"
import {PayTables} from "../../api/types/tables/pay-tables.js"
import {PayDatalayer} from "./webhooks/types/pay-datalayer.js"

export function payDatalayer({payTables, permissionsTables}: {
		payTables: PayTables
		permissionsTables: PermissionsTables
	}): PayDatalayer {
	return {
		async getUserHasPremiumRole(userId) {
			return permissionsTables.userHasRole.one(find({userId}))
		},

		async getStripeCustomerByCustomerId(stripeCustomerId) {
			return undefined
		},

		async upsertStripePremiumRow(row) {
			return undefined
		},

		async deleteStripePremiumRow(userId) {
			return undefined
		},

		async getStripePremiumRow(userId) {
			return undefined
		},

		async grantPremiumRoleUntil(userId) {
			return undefined
		},
	}
}
