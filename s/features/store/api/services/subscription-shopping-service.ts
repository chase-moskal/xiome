
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreServiceOptions} from "../../types/store-concepts.js"
import {fetchSubscriptionPlans} from "./helpers/fetch-subscription-plans.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storeLinkedPolicy)

.expose(auth => ({

	async listSubscriptionPlans() {
		return fetchSubscriptionPlans(auth)
	},

	async checkoutSubscriptionTier(tierId: string) {
		const storeTables = auth.database.tables.store

		const tierRow = await storeTables.subscriptions.tiers
			.readOne(dbmage.find({tierId: dbmage.Id.fromString(tierId)}))

		if (!tierRow)
			throw new Error(`subscription tier not found "${tierId}"`)

		const planRow = await storeTables.subscriptions.plans
			.readOne(dbmage.find({planId: tierRow.planId}))

		if (!planRow)
			throw new Error(`subscription not found "${tierRow.planId.toString()}"`)

		const session = await auth.stripeLiaisonAccount.checkout.sessions.create({
			mode: "subscription",
			line_items: [{
				price: tierRow.stripePriceId,
				quantity: 1,
			}],

			// TODO store callback links
			success_url: "",
			cancel_url: "",
		})

		return {
			stripeAccountId: auth.stripeAccountId,
			stripeSessionUrl: session.url,
			stripeSessionId: session.id,
		}
	},

	async unsubscribeFromTier(tierId: string) {

	},
}))
