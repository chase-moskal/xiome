
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types.js"
import {string, validator} from "../../../../toolbox/darkvalley.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {cancelStripeSubscription} from "./shopping/cancel-stripe-subscription.js"
import {PurchaseScenario, SubscriptionDetails} from "../../types/store-concepts.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {determinePurchaseScenario} from "../../common/determine-purchase-scenario.js"
import {uncancelStripeSubscription} from "./shopping/uncancel-stripe-subscription.js"
import {fetchAllSubscriptionDetails} from "./shopping/fetch-all-subscription-details.js"
import {prepareToBuyStripeSubscription} from "./shopping/prepare-to-buy-stripe-subscription.js"
import {verifyPlanHasExistingStripeSubscription} from "./shopping/verify-plan-has-existing-stripe-subscription.js"

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
