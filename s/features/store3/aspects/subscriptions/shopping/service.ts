
import * as renraku from "renraku"

import {StoreServiceOptions} from "../../../backend/types/options.js"
import {validator, string} from "../../../../../toolbox/darkvalley.js"
import {validateId} from "../../../../../common/validators/validate-id.js"
import {SubscriptionDetails, PurchaseScenario} from "../../../isomorphic/concepts.js"
import {runValidation} from "../../../../../toolbox/topic-validation/run-validation.js"
import {cancelStripeSubscription} from "../../../backend/utils/cancel-stripe-subscription.js"
import {uncancelStripeSubscription} from "../../../backend/utils/uncancel-stripe-subscription.js"
import {determinePurchaseScenario} from "../../../isomorphic/utils/determine-purchase-scenario.js"
import {fetchAllSubscriptionDetails} from "../../../backend/utils/fetch-all-subscription-details.js"
import {prepareToBuyStripeSubscription} from "../../../backend/utils/prepare-to-buy-stripe-subscription.js"
import {verifyPlanHasExistingStripeSubscription} from "../../../backend/utils/verify-plan-has-existing-stripe-subscription.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeCustomerPolicy)

.expose(auth => ({

	async fetchMySubscriptionDetails(): Promise<SubscriptionDetails[]> {
		return fetchAllSubscriptionDetails(auth)
	},

	async buy(stripePriceId: string) {
		const {
			subscription,
			defaultPaymentMethod,
			actions,
		} = await prepareToBuyStripeSubscription(options, auth, stripePriceId)

		stripePriceId = runValidation(stripePriceId, validator<string>(string()))

		const scenario = determinePurchaseScenario({
			hasDefaultPaymentMethod: !!defaultPaymentMethod,
			hasExistingSubscription: !!subscription,
		})

		switch (scenario) {
			case PurchaseScenario.Update:
				return actions.updateAndFulfillSubscription(subscription)

			case PurchaseScenario.UsePaymentMethod:
				return actions.createNewSubscriptionUsingExistingPaymentMethod(defaultPaymentMethod)

			case PurchaseScenario.CheckoutPopup:
				return actions.createCheckoutPopupToBuyNewSubscription()

			default:
				throw new Error("unknown purchase scenario")
		}
	},

	async cancelSubscription(tierId: string) {
		tierId = runValidation(tierId, validateId)
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await cancelStripeSubscription(auth, stripeSubscription.id)
	},

	async uncancelSubscription(tierId: string) {
		tierId = runValidation(tierId, validateId)
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await uncancelStripeSubscription(auth, stripeSubscription.id)
	},
}))
