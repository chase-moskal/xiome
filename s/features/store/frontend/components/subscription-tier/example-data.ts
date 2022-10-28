
import {TierBasics, TierContext} from "../../views/tier/types.js"
import {SubscriptionStatus} from "../../../isomorphic/concepts.js"

export const examples = {
	basics: <TierBasics>{
		tier: {
			active: true,
			label: "Example Tier",
			pricing: [{
				currency: "usd",
				interval: "month",
				price: 0,
				stripePriceId: "FAKE_STRIPE_PRICE_ID",
			}],
			roleId: "FAKE_ROLE_ID",
			tierId: "FAKE_TIER_ID",
			time: Date.now(),
		},
	},
	context: <TierContext>{
		isSubscribedToThisTier: true,
		status: SubscriptionStatus.Active,
	},
}
