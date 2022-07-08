import {StoreCustomerAuth} from "../../types.js"
import {getRowsForTierId} from "../helpers/get-rows-for-tier-id.js"

export async function createStripeSubscriptionViaExistingPaymentMethod(
		auth: StoreCustomerAuth,
		tierId: string
	) {

	const {tierRow} = await getRowsForTierId({tierId, auth})
	await auth.stripeLiaisonAccount.subscriptions.create({
		customer: auth.stripeCustomerId,
		items: [{
			price: tierRow.stripePriceId,
			quantity: 1,
		}],
	})
}
