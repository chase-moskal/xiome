
import {StoreCustomerAuth} from "../../types.js"
import {findStripeSubscriptionForTier} from "../helpers/find-stripe-subscription-for-tier.js"

export async function verifyPlanHasExistingStripeSubscription(
		auth: StoreCustomerAuth,
		tierId: string
	) {

	const stripeSubscription = await findStripeSubscriptionForTier(auth, tierId)

	if (!stripeSubscription)
		throw new Error("user must already have a subscription")
	else
		return stripeSubscription
}
