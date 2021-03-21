
import {find} from "../../../../toolbox/dbby/dbby-x.js"
import {StoreTables} from "../../api/tables/types/store-tables.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {SubscriptionRow} from "../../api/tables/types/rows/subscription-row.js"

export function payDatalayer({tables}: {
			tables: StoreTables & AuthTables
		}) {

	return {

		

		// async getUserHasPremiumRole(userId: string) {
		// 	return tables.permissions.userHasRole.one(find({userId}))
		// },

		// async getStripeCustomerById(stripeCustomerId: string) {
		// 	return tables.billing.stripeCustomers.one(find({stripeCustomerId}))
		// },

		// async upsertStripePremiumRow(row: StripeSubscriptionRow) {
		// 	return tables.billing.stripePremiums.update({
		// 		...find({userId: row.userId}),
		// 		upsert: row,
		// 	})
		// },

		// async deleteStripePremiumRow(userId: string) {
		// 	return tables.billing.stripePremiums.delete(find({userId}))
		// },

		// async getStripePremiumRow(userId: string) {
		// 	return tables.billing.stripePremiums.one(find({userId}))
		// },

		// async grantPremiumRoleUntil(userId: string, timeframeEnd: number) {
		// 	throw new Error("TODO implement")
		// 	// const userHasAdmin = await tables.permissions.userHasRole
		// 	// 	.one(find({userId, roleId: adminRoleId}))
		// 	// if (userHasAdmin) {
		// 	// 	userHasAdmin.timeframeEnd = timeframeEnd
		// 	// 	await tables.permissions.userHasRole.update({
		// 	// 		...find({userId}),
		// 	// 		write: {timeframeEnd}
		// 	// 	})
		// 	// }
		// 	// else {
		// 	// 	await tables.permissions.userHasRole.create({
		// 	// 		userId,
		// 	// 		roleId: adminRoleId,
		// 	// 		timeframeEnd,
		// 	// 		timeframeStart: undefined,
		// 	// 		hard: false,
		// 	// 		public: true,
		// 	// 	})
		// 	// }
		// },
	}
}
