
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types.js"
import {SubscriptionDetails} from "../../types/store-concepts.js"
import {cancelStripeSubscription} from "./shopping/cancel-stripe-subscription.js"
import {uncancelStripeSubscription} from "./shopping/uncancel-stripe-subscription.js"
import {fetchAllSubscriptionDetails} from "./shopping/fetch-all-subscription-details.js"
import {prepareToBuyStripeSubscription} from "./shopping/prepare-to-buy-stripe-subscription.js"
import {automateArgumentValidationForTierId} from "./shopping/automate-argument-validation-for-tier-id.js"
import {verifyPlanHasExistingStripeSubscription} from "./shopping/verify-plan-has-existing-stripe-subscription.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeCustomerPolicy)

.expose(auth => ({

	async fetchMySubscriptionDetails(): Promise<SubscriptionDetails[]> {
		return fetchAllSubscriptionDetails(auth)
	},

	...automateArgumentValidationForTierId({

		async buy(tierId: string) {
			const {
				subscription,
				defaultPaymentMethod,
				actions,
			} = await prepareToBuyStripeSubscription(options, auth, tierId)

			if (subscription)
				return actions.updateAndFulfillSubscription(subscription)

			else {
				if (defaultPaymentMethod)
					return actions.createNewSubscriptionUsingExistingPaymentMethod(defaultPaymentMethod)

				else
					return actions.createCheckoutPopupToBuyNewSubscription()
			}
		},

		async cancelSubscription(tierId: string) {
			const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
			await cancelStripeSubscription(auth, stripeSubscription.id)
		},

		async uncancelSubscription(tierId: string) {
			const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
			await uncancelStripeSubscription(auth, stripeSubscription.id)
		},
	}),
}))
