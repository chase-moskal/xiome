
import * as dbmage from "dbmage"

import {StoreCustomerAuth} from "../../types.js"
import {SubscriptionTierRow} from "../../../types/store-schema.js"
import {findSubscriptionforPlanRelatingToTier} from "../helpers/get-current-stripe-subscription.js"

export async function verifyPlanHasExistingStripeSubscription(
		auth: StoreCustomerAuth,
		tierId: string
	) {

	const stripeSubscription = await findSubscriptionforPlanRelatingToTier(auth, tierId)
	if (!stripeSubscription)
		throw new Error("user must already have a subscription")
	else
		return stripeSubscription
}
