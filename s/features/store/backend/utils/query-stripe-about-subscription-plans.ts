
import {StoreConnectedAuth} from "../policies/types.js"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"
import {SubscriptionTierRow} from "../database/types/rows/subscription-tier-row.js"
import {SubscriptionPlanRow} from "../database/types/rows/subscription-plan-row.js"


export async function queryStripeAboutSubscriptionPlans({
		auth, tierRows
	}: {
		auth: StoreConnectedAuth
		planRows: SubscriptionPlanRow[]
		tierRows: SubscriptionTierRow[]
	}) {

	const {stripeLiaisonAccount} = auth

	const stripeProducts = (await Promise.all(
		tierRows
			.map(async row => (
				await stripeLiaisonAccount
					.products
					.retrieve(row.stripeProductId)
			))
	)).filter(p => !!p)

	const stripePrices = (await Promise.all(
		stripeProducts.map(async product => {
			const stripePriceId = getStripeId(product.default_price)
			return stripePriceId
				? await stripeLiaisonAccount.prices
						.retrieve(stripePriceId)
				: undefined
		})
	)).filter(p => !!p)

	return {stripeProducts, stripePrices}
}
