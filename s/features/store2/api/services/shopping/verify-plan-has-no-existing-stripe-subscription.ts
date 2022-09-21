
import {StoreCustomerAuth} from "../../types.js"
import {findStripeSubscriptionForTier} from "../helpers/find-stripe-subscription-for-tier.js"

export async function verifyPlanHasNoExistingStripeSubscription(
		auth: StoreCustomerAuth,
		tierId: string
	) {

	const stripeSubscription = await findStripeSubscriptionForTier(auth, tierId)

	if (stripeSubscription)
		throw new Error("stripe subscription already exists for this plan, cannot create a new one")
}
