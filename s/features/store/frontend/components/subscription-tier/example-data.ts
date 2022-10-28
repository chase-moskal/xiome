
import {TierBasics, TierContext} from "../../views/tier/types.js"
import {SubscriptionStatus} from "../../../isomorphic/concepts.js"

const examplePricing = {
	currency: "usd",
	interval: "month",
	price: 0,
	stripePriceId: "FAKE_STRIPE_PRICE_ID",
}

export const examples = {
	basics: <TierBasics>{
		tier: {
			active: true,
			label: "Example Tier",
			pricing: [examplePricing],
			roleId: "FAKE_ROLE_ID",
			tierId: "FAKE_TIER_ID",
			time: Date.now(),
		},
		pricing: examplePricing,
	},
	context: <TierContext>{
		isSubscribedToThisTier: true,
		status: SubscriptionStatus.Active,
	},
}
