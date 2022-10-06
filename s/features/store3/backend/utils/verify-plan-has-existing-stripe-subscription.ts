
import {StoreCustomerAuth} from "../policies/types.js"
import {findStripeSubscriptionRelatedToTier} from "./find-stripe-subscription-related-to-tier.js"

export async function verifyPlanHasExistingStripeSubscription(
		auth: StoreCustomerAuth,
		tierId: string
	) {

	const stripeSubscription = await findStripeSubscriptionRelatedToTier(auth, tierId)

	if (!stripeSubscription)
		throw new Error("user must already have a subscription")
	else
		return stripeSubscription
}
