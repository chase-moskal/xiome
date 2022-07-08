
import {StoreCustomerAuth} from "../../types.js"
import {findSubscriptionforPlanRelatingToTier} from "../helpers/get-current-stripe-subscription.js"

export async function verifyPlanHasNoExistingStripeSubscription(
		auth: StoreCustomerAuth,
		tierId: string
	) {

	const stripeSubscription = await findSubscriptionforPlanRelatingToTier(auth, tierId)
	if(stripeSubscription)
		throw new Error("stripe subscription already exists for this plan, cannot create a new one")
}
