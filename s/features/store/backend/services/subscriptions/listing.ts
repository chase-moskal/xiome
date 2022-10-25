
import * as renraku from "renraku"
import {StoreServiceOptions} from "../../types/options.js"
import {queryStripeAboutSubscriptionPlans} from "../../utils/query-stripe-about-subscription-plans.js"
import {queryDatabaseAboutSubscriptionPlans} from "../../utils/query-database-about-subscription-plans.js"
import {performSelfHealingRoutinesForSubscriptionPlans} from "../../utils/perform-self-healing-routines-for-subscription-plans.js"
import {compileDataTogetherIntoSubscriptionPlansForFrontend} from "../../utils/compile-data-together-into-subscription-plans-for-frontend.js"

export const makeSubscriptionListingService = (options: StoreServiceOptions) =>
renraku
.service()
.policy(options.storePolicies.connected)
.expose(auth => ({

	async listPlans() {

		const {planRows, tierRows} =
			await queryDatabaseAboutSubscriptionPlans(auth)

		const {stripeProducts, stripePrices} =
			await queryStripeAboutSubscriptionPlans({
				auth,
				planRows,
				tierRows,
			})

		await performSelfHealingRoutinesForSubscriptionPlans({
			auth,
			planRows,
			tierRows,
			stripeProducts,
			stripePrices,
		})

		return compileDataTogetherIntoSubscriptionPlansForFrontend({
			planRows,
			tierRows,
			stripeProducts,
			stripePrices,
		})
	},

}))
