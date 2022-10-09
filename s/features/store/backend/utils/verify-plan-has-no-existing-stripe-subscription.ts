
import {StoreCustomerAuth} from "../policies/types.js"
import {findStripeSubscriptionRelatedToTier} from "./find-stripe-subscription-related-to-tier.js"

export async function verifyPlanHasNoExistingStripeSubscription(
		auth: StoreCustomerAuth,
		tierId: string
	) {

	const stripeSubscription = await findStripeSubscriptionRelatedToTier(auth, tierId)

	if (stripeSubscription)
		throw new Error("stripe subscription already exists for this plan, cannot create a new one")
}
