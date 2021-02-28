
import {find} from "../../../../toolbox/dbby/dbby-x.js"
import {PayTables} from "../../api/tables/types/pay-tables.js"
import {PayDatalayer} from "./webhooks/types/pay-datalayer.js"

export function payDatalayer({tables}: {
			tables: PayTables
		}): PayDatalayer {

	return {
		async getUserHasPremiumRole(userId) {
			return tables.permissions.userHasRole.one(find({userId}))
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
