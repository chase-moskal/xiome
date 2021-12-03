
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {StripeLiaisonAccount} from "../../../types/store-concepts.js"
import {find, findAll} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {stripeAttempt} from "../../../stripe/liaison/helpers/stripe-attempt.js"
import {StoreTables, SubscriptionPlanRow} from "../../../types/store-tables.js"

export function subscriptionHelpers({
		storeTables, stripeAccountId, stripeLiaisonAccount,
	}: {
		stripeAccountId: string
		storeTables: StoreTables
		stripeLiaisonAccount: StripeLiaisonAccount
	}) {

	return {

		async fetchOurSubscriptionPlanRecords() {
			return storeTables.subscription.plans.read(find({stripeAccountId}))
		},

		async crossReferenceWithStripeProducts(planRows: SubscriptionPlanRow[]) {
			const planRowsWithStripeProducts = await Promise.all(
				planRows.map(async planRow => {
					const stripeProduct = await stripeAttempt(
						() => stripeLiaisonAccount.products
							.retrieve(planRow.stripeProductId)
					)
					return {stripeProduct, planRow}
				})
			)
			const missingPlanIds = planRowsWithStripeProducts
				.filter(({stripeProduct}) => stripeProduct === undefined)
				.map(({planRow}) => planRow.planId)
			return {
				missingPlanIds,
				planRowsWithStripeProducts,
			}
		},

		async deletePlansThatNoLongerExistOnStripe(planIds: DamnId[]) {
			if (planIds.length) {
				await storeTables.subscription.plans.delete(
					findAll(planIds, planId => ({planId}))
				)
			}
		},
	}
}
