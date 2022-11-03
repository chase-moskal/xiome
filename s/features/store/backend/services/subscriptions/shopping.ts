
import * as renraku from "renraku"

import {StoreServiceOptions} from "../../types/options.js"
import {validator, string} from "../../../../../toolbox/darkvalley.js"
import {validateId} from "../../../../../common/validators/validate-id.js"
import {buildSubscriptionDetails} from "../../utils/build-subscription-details.js"
import {cancelStripeSubscription} from "../../utils/cancel-stripe-subscription.js"
import {SubscriptionDetails, PurchaseScenario} from "../../../isomorphic/concepts.js"
import {uncancelStripeSubscription} from "../../utils/uncancel-stripe-subscription.js"
import {runValidation} from "../../../../../toolbox/topic-validation/run-validation.js"
import {prepareToBuyStripeSubscription} from "../../utils/prepare-to-buy-stripe-subscription.js"
import {determinePurchaseScenario} from "../../../isomorphic/utils/determine-purchase-scenario.js"
import {verifyPlanHasExistingStripeSubscription} from "../../utils/verify-plan-has-existing-stripe-subscription.js"
import {fetchStripeSubscriptionsForCustomer} from "../../utils/fetch-stripe-subscriptions-for-customer.js"
import {queryStripePriceRelatedToSubscription} from "../../utils/query-stripe-price-related-to-subscription.js"
import {queryTierRowRelatedToStripePrice} from "../../utils/query-tier-row-related-to-stripe-price.js"

export const makeSubscriptionShoppingService = (options: StoreServiceOptions) =>
renraku
.service()
.policy(options.storePolicies.customer)
.expose(auth => ({

	async fetchDetailsAboutMySubscriptions(): Promise<SubscriptionDetails[]> {
		const subscriptions = await fetchStripeSubscriptionsForCustomer(auth)

		return Promise.all(
			subscriptions.map(async subscription => {

				const price = await queryStripePriceRelatedToSubscription(
					auth.stripeLiaisonAccount,
					subscription,
				)

				const tierRow = await queryTierRowRelatedToStripePrice(
					auth.storeDatabase,
					price,
				)

				return buildSubscriptionDetails(
					subscription,
					price,
					tierRow,
				)
			})
		)
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

	async cancel(tierId: string) {
		tierId = runValidation(tierId, validateId)
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await cancelStripeSubscription(auth, stripeSubscription.id)
	},

	async uncancel(tierId: string) {
		tierId = runValidation(tierId, validateId)
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await uncancelStripeSubscription(auth, stripeSubscription.id)
	},
}))
