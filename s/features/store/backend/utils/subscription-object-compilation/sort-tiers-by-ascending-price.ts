
import {SubscriptionTier} from "../../../isomorphic/concepts.js"

export function sortTiersByAscendingPrice(
		a: SubscriptionTier,
		b: SubscriptionTier,
	) {

	return a.pricing[0].price - b.pricing[0].price
}
